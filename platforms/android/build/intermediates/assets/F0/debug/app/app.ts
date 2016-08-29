import application = require("application");
import connectivityMonitor = require("./shared/connectivityMonitor");

application.on(application.launchEvent, function (args) {
    console.log("** Application LaunchEvent **");

    // Wire up connectivity monitor to start monitoring
    connectivityMonitor.ConnectivityMonitor.Instance.startMonitoring();
});

application.start({ moduleName: "pages/main-page" });
