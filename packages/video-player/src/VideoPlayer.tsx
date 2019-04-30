import { flattenStyles } from "@native-mobile-resources/util-widgets";
import { Component, createElement, createRef } from "react";
import { ActivityIndicator, View } from "react-native";
import Video, { OnLoadData } from "react-native-video";
import { VideoPlayerProps } from "../typings/VideoPlayerProps";
import { defaultVideoStyle } from "./ui/Styles";

export type Props = VideoPlayerProps<undefined>;

interface State {
    loading: boolean;
    width: number;
    height: number;
}

export class VideoPlayer extends Component<Props, State> {
    readonly state = {
        loading: true,
        width: 0,
        height: 0
    };

    private readonly onLoadStartHandler = this.onLoadStart.bind(this);
    private readonly onLoadHandler = this.onLoad.bind(this);
    private readonly styles = flattenStyles(defaultVideoStyle, this.props.style);
    private readonly videoRef = createRef<Video>();

    render(): JSX.Element {
        const uri = this.props.videoUrl && this.props.videoUrl.value;
        let styles = {};

        if (this.props.aspectRatio) {
            styles = {
                ...this.styles.container,
                aspectRatio: this.state.width / this.state.height
            };
        } else {
            styles = {
                ...this.styles.container,
                minHeight: this.state.height
            };
        }

        return (
            <View style={styles}>
                {this.state.loading && <ActivityIndicator color={this.styles.indicator.color} size="large" />}
                <Video
                    source={{ uri }}
                    paused={!this.props.autoStart}
                    muted={this.props.muted}
                    repeat={this.props.loop}
                    controls={this.props.showControls}
                    onLoadStart={this.onLoadStartHandler}
                    onLoad={this.onLoadHandler}
                    style={this.state.loading ? { height: 0 } : this.styles.video}
                    useTextureView={false}
                    resizeMode="contain"
                    ref={this.videoRef}
                />
            </View>
        );
    }

    private onLoadStart(): void {
        this.setState({ loading: true });
    }

    private onLoad(data: OnLoadData): void {
        this.setState({ loading: false, width: data.naturalSize.width, height: data.naturalSize.height });
    }
}
