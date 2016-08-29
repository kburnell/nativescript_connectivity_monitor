import connectivity = require("connectivity");
import dialogs = require("ui/dialogs");
import observable = require("data/observable");
import { ConnectivityMonitor } from "../shared/connectivityMonitor";

export class MainViewModel extends observable.Observable {

    private _connectivityMonitor: ConnectivityMonitor = ConnectivityMonitor.Instance;
    private _connectionStatus: string;
    private _message: string;

    get connectionStatus(): string {
        return this._connectionStatus;
    }

    set connectionStatus(value: string) {
        if (this._connectionStatus !== value) {
            this._connectionStatus = value;
            this.notifyPropertyChange("connectionStatus", this._connectionStatus);
        }
    }

    get message(): string {
        return this._message;
    }

    constructor() {
        super();
        this._message = "Toggle your machines ethernet/wifi connection to see callback";

        // Set Current Connection Status Label
        this.setConnectionStatusMessage(this._connectivityMonitor.connectionStatus);

        // Add callback for status changed
        this._connectivityMonitor.addConnectionStatusChangedCallback(this.setConnectionStatusMessage);

        // Add callback for status changed to Offline
        this._connectivityMonitor.addConnectionStatusChangedToOfflineCallback(this.connectionStatusChangedToOffline);

        // Add callback for status changed to Online
        this._connectivityMonitor.addConnectionStatusChangedToOnlineCallback(this.connectionStatusChangedToOnline);

    }

    private setConnectionStatusMessage = (connectionType: number) => {
        let status: string = "Online :)";
        if (connectionType === connectivity.connectionType.none) {
            status = "Offline :(";
        }
        this.connectionStatus = "You are currently: " + status;
    }

    private connectionStatusChangedToOffline() {
        dialogs.alert("You just went offline!");
    }

    private connectionStatusChangedToOnline() {
        dialogs.alert("You are back online!");
    }
}
