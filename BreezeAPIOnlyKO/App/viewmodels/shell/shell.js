define(['durandal/plugins/router', 'durandal/app', 'configuration', 'services/datacontext', 'services/bindings'], function (router, app, config, datacontext, bindings) {
    
    var activate = function () {
        var routes = config.routes;
        router.map(routes);
        return router.activate('home');
    };

    var shell = {
        router: router,
        activate: activate
    };

    return shell;
});