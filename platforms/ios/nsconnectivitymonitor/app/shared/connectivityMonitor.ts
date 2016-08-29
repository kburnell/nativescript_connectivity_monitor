import connectivity = require("connectivity");
import dialogs = require("ui/dialogs");
import frames = require("ui/frame");

/* This is a singleton class and is meant to be used in that manner.
   Unfortunately Typescript currently does not allow for access modifiers
   on constructors so true singelton usage can not be enforced

   Usage:
    - in app.js call 'startMonitoring' to start monitoring connectivity
    - call the appropriate 'addConnectionStatusChanged*' function passing
      the function to execute when the associated condition is met.
        * callbacks in addConnectionStatusChangedCallback will execute whenever the connection status changes passing the new connectionType
        * callbacks in addConnectionStatusChangedToOfflineCallback will only execute when connectivity goes offline (connectionType = none)
        * callbacks in addConnectionStatusChangedToOnlineCallback will only execute when connectivity goes online (connectionType = wifi || mobile)
*/
class ConnectivityMonitor {

    private static _instance: ConnectivityMonitor;

    private _connectionStatus: number;
    private _offlineConnectedStatusType: number = connectivity.connectionType.none;
    private _connectionStatusChangedCallbacks: { (connectionStatus: number): void }[];
    private _connectionStatusChangedToOnlineCallbacks: { (): void }[];
    private _connectionStatusChangedToOfflineCallbacks: { (): void }[];

    constructor() {
        this._connectionStatusChangedCallbacks = [];
        this._connectionStatusChangedToOnlineCallbacks = [];
        this._connectionStatusChangedToOfflineCallbacks = [];
        this._connectionStatus = connectivity.getConnectionType();
    }

    static get Instance(): ConnectivityMonitor {
        if (!this._instance) {
            this._instance = new ConnectivityMonitor();
        }
        return this._instance;
    }

    get connectionStatus(): number {
        return this._connectionStatus;
    }

    get connected(): boolean {
        return (this._connectionStatus !== this._offlineConnectedStatusType);
    }

    public startMonitoring() {
        console.log("** Monitoring Connection Status");
        connectivity.startMonitoring(this.monitorConnectionStatus);
    }

    public addConnectionStatusChangedCallback(callback: (n: number) => void) {
        this._connectionStatusChangedCallbacks.push(callback);
    }

    public addConnectionStatusChangedToOnlineCallback(callback: () => void) {
        this._connectionStatusChangedToOnlineCallbacks.push(callback);
    }

    public addConnectionStatusChangedToOfflineCallback(callback: () => void) {
        this._connectionStatusChangedToOfflineCallbacks.push(callback);
    }

    private monitorConnectionStatus = (newConnectionType: number) => {
        console.log("** Connection Status Changed To: " + newConnectionType);

        this._connectionStatus = newConnectionType;

        if (this._connectionStatus === this._offlineConnectedStatusType) {
            // Went offline, kick off any changed to offline callbacks
            this.processCallbacksWithoutParam(this._connectionStatusChangedToOfflineCallbacks);
        }
        else if (this._connectionStatus !== this._offlineConnectedStatusType) {
            // Came online, kick off any changed to online callbacks
            // At this time Online = connectionType.wifi || connectionType.mobile
            this.processCallbacksWithoutParam(this._connectionStatusChangedToOnlineCallbacks);
        }
        // Process any connection status changed callbacks
        this.processCallbacks(newConnectionType, this._connectionStatusChangedCallbacks);
    }
    private processCallbacksWithoutParam(callbacks: { (): void }[]) {
        for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]();
        }
    }

    private processCallbacks(newConnectionType: number, callbacks: { (connectionStatus: number): void }[]) {
        for (let i = 0; i < callbacks.length; i++) {
            callbacks[i](newConnectionType);
        }
    }
}

export { ConnectivityMonitor }
