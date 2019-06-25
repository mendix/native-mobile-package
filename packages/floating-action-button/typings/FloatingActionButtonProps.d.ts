/**
 * This file was generated from FloatingActionButton.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { ActionValue, DynamicValue, NativeIcon } from "@mendix/pluggable-widgets-api/properties";

interface CommonProps<Style> {
    style: Style[];
}

export type HorizontalPositionEnum = "left" | "center" | "right";

export type VerticalPositionEnum = "top" | "bottom";

export interface SecondaryButtonsType {
    icon: DynamicValue<NativeIcon>;
    caption?: DynamicValue<string>;
    onClick: ActionValue;
}

export interface FloatingActionButtonProps<Style> extends CommonProps<Style> {
    icon?: DynamicValue<NativeIcon>;
    iconActive?: DynamicValue<NativeIcon>;
    horizontalPosition: HorizontalPositionEnum;
    verticalPosition: VerticalPositionEnum;
    onClick: ActionValue;
    secondaryButtons: SecondaryButtonsType[];
}
