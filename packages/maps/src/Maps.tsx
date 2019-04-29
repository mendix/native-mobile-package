import { Icon } from "@mendix/pluggable-widgets-api/components/native/Icon";
import { ActionValue, DynamicValue } from "@mendix/pluggable-widgets-api/properties";
import { flattenStyles } from "@native-mobile-resources/util-widgets";
import { Component, createElement, createRef } from "react";
import { View } from "react-native";
import Geocoder, { GeocodingObject } from "react-native-geocoder";
import MapView, { LatLng, Marker } from "react-native-maps";

import { DefaultZoomLevelEnum, MapsProps, MarkersType } from "../typings/MapsProps";
import { defaultMapsStyle, MapsStyle } from "./ui/Styles";
import { PromiseQueue } from "./util/promise-queue";

type Props = MapsProps<MapsStyle>;

interface State {
    geocodeCache: { [address: string]: LatLng | undefined };
}

export class Maps extends Component<Props, State> {
    readonly state: State = {
        geocodeCache: {}
    };

    private readonly styles = flattenStyles(defaultMapsStyle, this.props.style);
    private readonly mapViewRef = createRef<MapView>();
    private readonly geocodeQueue = new PromiseQueue<GeocodingObject[]>();

    private geocodeInProgress: { [address: string]: boolean | undefined } = {};

    componentDidMount(): void {
        this.updateCamera(false);
    }

    componentDidUpdate(): void {
        this.updateCamera(true);
    }

    render(): JSX.Element {
        return (
            <View style={this.styles.container}>
                <MapView
                    ref={this.mapViewRef}
                    provider={this.props.provider === "default" ? null : this.props.provider}
                    mapType={this.props.mapType}
                    showsUserLocation={this.props.showsUserLocation}
                    showsMyLocationButton={this.props.showsUserLocation}
                    showsTraffic={false}
                    minZoomLevel={toZoomValue(this.props.minZoomLevel)}
                    maxZoomLevel={toZoomValue(this.props.maxZoomLevel)}
                    rotateEnabled={this.props.interactive}
                    scrollEnabled={this.props.interactive}
                    pitchEnabled={false}
                    zoomEnabled={this.props.interactive}
                    style={{ flex: 1 }}
                    liteMode={!this.props.interactive}
                    cacheEnabled={!this.props.interactive}
                    showsPointsOfInterest={false}
                    mapPadding={{ top: 40, right: 20, bottom: 20, left: 20 }}
                >
                    {this.props.markers.map((marker, index) => this.renderMarker(marker, index))}
                </MapView>
            </View>
        );
    }

    private renderMarker(marker: MarkersType, index: number): JSX.Element | null {
        const coordinate = this.parseCoordinate(marker.latitude, marker.longitude, marker.address);

        if (!coordinate) {
            return null;
        }

        return (
            <Marker
                key={"map_marker_" + index}
                title={this.props.interactive ? marker.title && marker.title.value : ""}
                description={this.props.interactive ? marker.description && marker.description.value : ""}
                coordinate={coordinate}
                pinColor={marker.color || this.styles.marker.color}
                opacity={this.styles.marker.opacity}
                // tslint:disable-next-line:jsx-no-lambda
                onPress={() => (this.props.interactive ? onMarkerPress(marker.onClick) : null)}
            >
                {marker.icon && marker.icon.value && (
                    <Icon
                        icon={marker.icon.value}
                        color={marker.color || this.styles.marker.color}
                        size={marker.iconSize}
                    />
                )}
            </Marker>
        );
    }

    private updateCamera(animate: boolean): void {
        if (!this.mapViewRef.current) {
            return;
        }

        if (this.props.fitToMarkers && this.props.markers.length > 1) {
            this.mapViewRef.current.fitToElements(animate);
            return;
        }

        const center =
            this.props.markers.length === 1 && this.props.fitToMarkers
                ? this.parseCoordinate(
                      this.props.markers[0].latitude,
                      this.props.markers[0].longitude,
                      this.props.markers[0].address
                  )
                : this.parseCoordinate(this.props.centerLatitude, this.props.centerLongitude, this.props.centerAddress);

        if (!center) {
            return;
        }

        const camera = {
            center,
            zoom: toZoomValue(this.props.defaultZoomLevel),
            altitude: toAltitude(this.props.defaultZoomLevel)
        };

        if (animate) {
            this.mapViewRef.current.animateCamera(camera);
        } else {
            this.mapViewRef.current.setCamera(camera);
        }
    }

    private parseCoordinate(
        latitudeProp?: DynamicValue<BigJs.Big>,
        longitudeProp?: DynamicValue<BigJs.Big>,
        addressProp?: DynamicValue<string>
    ): LatLng | null {
        if (latitudeProp && latitudeProp.value && longitudeProp && longitudeProp.value) {
            const latitude = Number(latitudeProp.value);
            const longitude = Number(longitudeProp.value);

            if (isValidLatitude(latitude) && isValidLongitude(longitude)) {
                return { latitude, longitude };
            }
        }

        if (addressProp && addressProp.value) {
            const coordinate = this.geocodeWithCache(addressProp.value);
            if (coordinate) {
                return coordinate;
            }
        }

        return null;
    }

    private geocodeWithCache(address: string): LatLng | null {
        const cachedValue = this.state.geocodeCache[address];
        if (cachedValue) {
            return cachedValue;
        }

        if (!this.geocodeInProgress[address]) {
            this.geocodeInProgress = { ...this.geocodeInProgress, [address]: true };

            this.geocodeQueue
                .add(() => Geocoder.geocodeAddress(address))
                .then(results => {
                    if (results.length === 0) {
                        throw new Error(`No location found for the provided address: ${address}`);
                    }

                    const coordinate: LatLng = {
                        latitude: results[0].position.lat,
                        longitude: results[0].position.lng
                    };

                    if (this.mapViewRef.current) {
                        this.setState({
                            geocodeCache: { ...this.state.geocodeCache, [address]: coordinate }
                        });
                    }
                })
                .catch(() => {
                    throw new Error(`Failed to retrieve a location for the provided address: ${address}`);
                });
        }

        return null;
    }
}

function isValidLatitude(latitude: number): boolean {
    return !isNaN(latitude) && latitude <= 90 && latitude >= -90;
}

function isValidLongitude(longitude: number): boolean {
    return !isNaN(longitude) && longitude <= 180 && longitude >= -180;
}

function onMarkerPress(action?: ActionValue): void {
    if (action && action.canExecute) {
        action.execute();
    }
}

function toZoomValue(level: DefaultZoomLevelEnum): number {
    switch (level) {
        case "world":
            return 3;
        case "continent":
            return 5;
        case "country":
            return 7;
        case "city":
            return 10;
        case "town":
            return 12;
        case "streets":
            return 15;
        case "building":
            return 20;
    }
}

function toAltitude(level: DefaultZoomLevelEnum): number {
    switch (level) {
        case "world":
            return 16026161;
        case "continent":
            return 4006540;
        case "country":
            return 1001635;
        case "city":
            return 125204;
        case "town":
            return 31301;
        case "streets":
            return 3914;
        case "building":
            return 122;
    }
}
