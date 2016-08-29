"use strict";
var connectivity = require("connectivity");
var dialogs = require("ui/dialogs");
var observable = require("data/observable");
var connectivityMonitor_1 = require("../shared/connectivityMonitor");
var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        var _this = this;
        _super.call(this);
        this._connectivityMonitor = connectivityMonitor_1.ConnectivityMonitor.Instance;
        this.setConnectionStatusMessage = function (connectionType) {
            var status = "Online :)";
            if (connectionType === connectivity.connectionType.none) {
                status = "Offline :(";
            }
            _this.connectionStatus = "You are currently: " + status;
        };
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
    Object.defineProperty(MainViewModel.prototype, "connectionStatus", {
        get: function () {
            return this._connectionStatus;
        },
        set: function (value) {
            if (this._connectionStatus !== value) {
                this._connectionStatus = value;
                this.notifyPropertyChange("connectionStatus", this._connectionStatus);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MainViewModel.prototype, "message", {
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    MainViewModel.prototype.connectionStatusChangedToOffline = function () {
        dialogs.alert("You just went offline!");
    };
    MainViewModel.prototype.connectionStatusChangedToOnline = function () {
        dialogs.alert("You are back online!");
    };
    return MainViewModel;
}(observable.Observable));
exports.MainViewModel = MainViewModel;
//# sourceMappingURL=main-view-model.js.map