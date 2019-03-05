// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import ReactNative from "react-native";

/**
 * @returns {string}
 */
function HideKeyboard(): void {
    // BEGIN USER CODE
    // Documentation https://facebook.github.io/react-native/docs/keyboard

    const Keyboard: typeof ReactNative.Keyboard = require("react-native").Keyboard;

    Keyboard.dismiss();

    // END USER CODE
}