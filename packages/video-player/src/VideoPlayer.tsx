import { flattenStyles } from "@native-mobile-resources/util-widgets";
import { Component, createElement, createRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Video, { OnLoadData } from "react-native-video";
import { VideoPlayerProps } from "../typings/VideoPlayerProps";
import { defaultVideoStyle } from "./ui/Styles";

export type Props = VideoPlayerProps<undefined>;

interface State {
    loading: boolean;
    aspectRatio: number;
    error: boolean;
}

export class VideoPlayer extends Component<Props, State> {
    readonly state = {
        loading: true,
        aspectRatio: 0,
        error: false
    };

    private readonly onLoadStartHandler = this.onLoadStart.bind(this);
    private readonly onLoadHandler = this.onLoad.bind(this);
    private readonly onErrorHandler = this.onError.bind(this);
    private readonly styles = flattenStyles(defaultVideoStyle, this.props.style);
    private readonly videoRef = createRef<Video>();

    render(): JSX.Element {
        const uri = this.props.videoUrl && this.props.videoUrl.value;

        const styles = { ...this.styles.container };

        if (this.props.aspectRatio && this.state.aspectRatio > 0) {
            styles.aspectRatio = this.state.aspectRatio;
        }

        return (
            <View style={styles}>
                {this.state.loading && <ActivityIndicator color={this.styles.indicator.color} size="large" />}
                {this.state.error && (
                    <Text style={this.styles.errorMessage}>We are unable to show the video content :(</Text>
                )}
                <Video
                    source={{ uri }}
                    paused={!this.props.autoStart}
                    muted={this.props.muted}
                    repeat={this.props.loop}
                    controls={this.props.showControls}
                    onLoadStart={this.onLoadStartHandler}
                    onLoad={this.onLoadHandler}
                    onError={this.onErrorHandler}
                    style={this.state.loading || this.state.error ? { height: 0 } : this.styles.video}
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
        this.setState({ loading: false, aspectRatio: data.naturalSize.width / data.naturalSize.height });
    }

    private onError(): void {
        this.setState({ loading: false, error: true });
    }
}
