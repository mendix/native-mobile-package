import { Style } from "@native-mobile-resources/util-widgets";
import { TextStyle, ViewStyle } from "react-native";

export interface BadgeStyle extends Style {
    container: ViewStyle;
    caption: TextStyle;
}

export const defaultBadgeStyle: BadgeStyle = {
    container: {
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#ccc"
    },
    caption: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
        alignSelf: "center"
    }
};
