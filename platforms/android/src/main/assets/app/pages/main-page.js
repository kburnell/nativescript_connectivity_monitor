"use strict";
var main_view_model_1 = require("../view_models/main-view-model");
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    // Get the event sender
    var page = args.object;
    page.bindingContext = new main_view_model_1.MainViewModel();
}
exports.navigatingTo = navigatingTo;
//# sourceMappingURL=main-page.js.map