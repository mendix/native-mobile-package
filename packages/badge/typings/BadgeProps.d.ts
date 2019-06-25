/**
 * This file was generated from Badge.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { ActionValue, DynamicValue } from "mendix/properties";

interface CommonProps<Style> {
    style: Style[];
}

export interface BadgeProps<Style> extends CommonProps<Style> {
    caption: DynamicValue<string>;
    onClick?: ActionValue;
}
