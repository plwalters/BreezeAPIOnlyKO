define(function () {

    //#region Toastr Options

    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
    toastr.options.backgroundpositionClass = 'toast-bottom-right';

    //#endregion

    var routes = [{
        url: 'home',
        moduleId: 'viewmodels/home',
        name: 'Home',
        visible: true,
        settings: {}
    }, {
        url: 'about',
        moduleId: 'viewmodels/about',
        name: 'about',
        visible: true,
        settings: {}
    }];

    var startModule = 'home';

    return {
        debugEnabled: ko.observable(true),
        routes: routes,
        startModule: startModule
    };
});