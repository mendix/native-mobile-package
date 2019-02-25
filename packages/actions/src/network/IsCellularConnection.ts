// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import ReactNative from "react-native";

/**
 * @returns {boolean}
 */
function IsCellularConnection(): Promise<boolean> {
    // BEGIN USER CODE

    const NetInfo: typeof ReactNative.NetInfo = require("react-native").NetInfo;

    return NetInfo.getConnectionInfo().then(({ type }) => type === "cell");

    // END USER CODE
}