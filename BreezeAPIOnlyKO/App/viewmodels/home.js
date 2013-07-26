define(['services/datacontext', 'viewmodels/shell/shell'], function (datacontext, shell) {

    var teams = ko.observableArray();

    var bindEventToList = function (rootSelector, selector, callback, eventName) {
        var eName = eventName || 'click';
        $(rootSelector).on(eName, selector, function () {
            var team = ko.dataFor(this);
            callback(team);
            return false;
        });
    };
    
    var toggleTeamNews = function (team) {
        if (team.showNews() === true) { team.showNews(false); }
        else {
            if (team.newsItems().length === 0) {
                // If we don't have news go get it
                datacontext.getTeamNews(team).fail(queryFailed);
            }
            // Else just show it
            team.showNews(true);
        }
    };

    var viewAttached = function (view) {
        bindEventToList(view, '.team-brief', toggleTeamNews);
    };

    var initLookups = function () {
        datacontext.getTeams(teams).fail(queryFailed);
    };

    function queryFailed(error) {
        logger.error(error.message, "Query failed; please try it again.");
    }

    var activate = function () {
        initLookups();
        return true;
    };

    var home = {
        activate: activate,
        teams: teams,
        viewAttached: viewAttached,
        shell: shell
    };

    return home;
});