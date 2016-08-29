"use strict";
var connectivity = require("connectivity");
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
var ConnectivityMonitor = (function () {
    function ConnectivityMonitor() {
        var _this = this;
        this._offlineConnectedStatusType = connectivity.connectionType.none;
        this.monitorConnectionStatus = function (newConnectionType) {
            _this._connectionStatus = newConnectionType;
            if (_this._connectionStatus === _this._offlineConnectedStatusType) {
                // Went offline, kick off any changed to offline callbacks
                _this.processCallbacksWithoutParam(_this._connectionStatusChangedToOfflineCallbacks);
            }
            else if (_this._connectionStatus !== _this._offlineConnectedStatusType) {
                // Came online, kick off any changed to online callbacks
                // At this time Online = connectionType.wifi || connectionType.mobile
                _this.processCallbacksWithoutParam(_this._connectionStatusChangedToOnlineCallbacks);
            }
            // Process any connection status changed callbacks
            _this.processCallbacks(newConnectionType, _this._connectionStatusChangedCallbacks);
        };
        this._connectionStatusChangedCallbacks = [];
        this._connectionStatusChangedToOnlineCallbacks = [];
        this._connectionStatusChangedToOfflineCallbacks = [];
        this._connectionStatus = connectivity.getConnectionType();
    }
    Object.defineProperty(ConnectivityMonitor, "Instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new ConnectivityMonitor();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectivityMonitor.prototype, "connectionStatus", {
        get: function () {
            return this._connectionStatus;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectivityMonitor.prototype, "connected", {
        get: function () {
            return (this._connectionStatus !== this._offlineConnectedStatusType);
        },
        enumerable: true,
        configurable: true
    });
    ConnectivityMonitor.prototype.startMonitoring = function () {
        console.log("** Monitoring Connection Status");
        connectivity.startMonitoring(this.monitorConnectionStatus);
    };
    ConnectivityMonitor.prototype.addConnectionStatusChangedCallback = function (callback) {
        this._connectionStatusChangedCallbacks.push(callback);
    };
    ConnectivityMonitor.prototype.addConnectionStatusChangedToOnlineCallback = function (callback) {
        this._connectionStatusChangedToOnlineCallbacks.push(callback);
    };
    ConnectivityMonitor.prototype.addConnectionStatusChangedToOfflineCallback = function (callback) {
        this._connectionStatusChangedToOfflineCallbacks.push(callback);
    };
    ConnectivityMonitor.prototype.processCallbacksWithoutParam = function (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
        }
    };
    ConnectivityMonitor.prototype.processCallbacks = function (newConnectionType, callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i](newConnectionType);
        }
    };
    return ConnectivityMonitor;
}());
exports.ConnectivityMonitor = ConnectivityMonitor;
//# sourceMappingURL=connectivityMonitor.js.map