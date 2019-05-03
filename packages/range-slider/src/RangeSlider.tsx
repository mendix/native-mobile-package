import { ValueStatus } from "@mendix/pluggable-widgets-api/properties";
import { flattenStyles } from "@native-mobile-resources/util-widgets";
import MultiSlider, { MarkerProps } from "@ptomasroos/react-native-multi-slider";
import { Component, createElement } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";

import { RangeSliderProps } from "../typings/RangeSliderProps";
import { Marker } from "./Marker";
import { defaultRangeSliderStyle, RangeSliderStyle, State } from "./ui/Styles";

export type Props = RangeSliderProps<RangeSliderStyle>;

export class RangeSlider extends Component<Props, State> {
    readonly state: State = {};

    private readonly onLayoutHandler = this.onLayout.bind(this);
    private readonly onSlideHandler = this.onSlide.bind(this);
    private readonly onChangeHandler = this.onChange.bind(this);
    private readonly styles = flattenStyles(defaultRangeSliderStyle, this.props.style);

    private lastLowerValue = Number(this.props.lowerValueAttribute.value);
    private lastUpperValue = Number(this.props.upperValueAttribute.value);

    render(): JSX.Element {
        const enabledOne = this.props.editable !== "never" && !this.props.lowerValueAttribute.readOnly;
        const enabledTwo = this.props.editable !== "never" && !this.props.upperValueAttribute.readOnly;
        const step =
            this.props.stepSize.value && this.props.stepSize.value.gt(0) ? Number(this.props.stepSize.value) : 1;

        const customMarker = (enabled: boolean) => (props: MarkerProps) => (
            <Marker {...props} markerStyle={enabled ? props.markerStyle : this.styles.markerDisabled} />
        );

        return (
            <View onLayout={this.onLayoutHandler} style={this.styles.container}>
                <MultiSlider
                    values={[
                        Number(this.props.lowerValueAttribute.value),
                        Number(this.props.upperValueAttribute.value)
                    ]}
                    min={Number(this.props.minimumValue.value)}
                    max={Number(this.props.maximumValue.value)}
                    step={step}
                    enabledOne={enabledOne}
                    enabledTwo={enabledTwo}
                    markerStyle={enabledOne || enabledTwo ? this.styles.marker : this.styles.markerDisabled}
                    trackStyle={enabledOne || enabledTwo ? this.styles.track : this.styles.trackDisabled}
                    selectedStyle={enabledOne || enabledTwo ? this.styles.highlight : this.styles.highlightDisabled}
                    pressedMarkerStyle={this.styles.markerActive}
                    onValuesChange={this.onSlideHandler}
                    onValuesChangeFinish={this.onChangeHandler}
                    sliderLength={this.state.width}
                    isMarkersSeparated={true}
                    customMarkerLeft={customMarker(enabledOne)}
                    customMarkerRight={customMarker(enabledTwo)}
                />
                {this.props.lowerValueAttribute.validation && (
                    <Text style={this.styles.validationMessage}>{this.props.lowerValueAttribute.validation}</Text>
                )}
                {this.props.upperValueAttribute.validation && (
                    <Text style={this.styles.validationMessage}>{this.props.upperValueAttribute.validation}</Text>
                )}
            </View>
        );
    }

    private onLayout(event: LayoutChangeEvent): void {
        this.setState({
            width: event.nativeEvent.layout.width
        });
    }

    private onSlide(values: number[]): void {
        if (
            this.props.lowerValueAttribute.status === ValueStatus.Available &&
            this.props.upperValueAttribute.status === ValueStatus.Available
        ) {
            this.props.lowerValueAttribute.setTextValue(String(values[0]));
            this.props.upperValueAttribute.setTextValue(String(values[1]));
        }
    }

    private onChange(values: number[]): void {
        if (
            this.lastLowerValue != null &&
            this.lastLowerValue === values[0] &&
            this.lastUpperValue != null &&
            this.lastUpperValue === values[1]
        ) {
            return;
        }

        this.lastLowerValue = values[0];
        this.lastUpperValue = values[1];
        this.props.lowerValueAttribute.setTextValue(String(values[0]));
        this.props.upperValueAttribute.setTextValue(String(values[1]));

        if (this.props.onChange && this.props.onChange.canExecute) {
            this.props.onChange.execute();
        }
    }
}
