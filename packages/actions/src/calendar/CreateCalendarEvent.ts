// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import AddCalendarEventLib from "react-native-add-calendar-event";

function CreateCalendarEvent(
    title?: string,
    startDate?: Date,
    endDate?: Date,
    location?: string,
    allDay?: boolean,
    notes?: string
): Promise<string | undefined> {
    // BEGIN USER CODE
    // Documentation https://github.com/vonovak/react-native-add-calendar-event#creating-an-event

    const AddCalendarEvent: typeof AddCalendarEventLib = require("react-native-add-calendar-event");

    return AddCalendarEvent.presentEventCreatingDialog({
        title,
        startDate: startDate && startDate.toISOString(),
        endDate: endDate && endDate.toISOString(),
        location,
        allDay,
        notes
    }).then(result => {
        if (result.action === "SAVED") {
            return result.eventIdentifier;
        }
        return;
    });

    // END USER CODE
}
