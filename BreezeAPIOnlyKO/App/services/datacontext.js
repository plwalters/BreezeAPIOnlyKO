define(['services/logger', 'services/model', 'services/jsonResultsAdapter'],
    function (logger, model, jsonResultsAdapter) {
        var EntityQuery = breeze.EntityQuery;

        // ESPN's API - We only want to target the MLB Baseball API
        // the .from() method on our queries will define the method
        // and then our parameters will be defined in makeParameters method
        var serviceName = "http://api.espn.com/v1/sports/baseball/mlb";

        // This is the API Key obtained from ESPN for public use
        var myAPIKEY = "qubdkem5nhuctxtxghkx32nm";

        // Initialize our DataService that we will use
        var ds = new breeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            useJsonp: true,
            jsonResultsAdapter: jsonResultsAdapter
        });

        // Function for configuring our EntityManager with our 
        // previously initialized DataService
        function configureBreezeManager() {
            var mgr = new breeze.EntityManager({ dataService: ds });
            return mgr;
        }

        // Go create the manager
        var manager = configureBreezeManager();

        // Initialize our Manager's MetadataStore
        model.initialize(manager.metadataStore);
        var metadataStore = manager.metadataStore;

        var getTeams = function (teamsObservable, forceRemote) {
            if (!forceRemote) {
                var p = getLocal('Teams', 'Team', 'id');  //Go check and see if we have this locally already
                if (p.length > 0) {
                    teamsObservable(p);
                    log('Retrieved [Teams] from cache', p, true);
                    return Q.resolve();  //Resolve any promises that are waiting on a resolution
                }
            }
            // Create the parameters for our query
            var parameters = makeParameters();
            // Get teams and map them back to type of 'Team'
            var query = breeze.EntityQuery
                .from("teams")
                .withParameters(parameters)
                .toType('Team');

            return manager.executeQuery(query).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var s = data.results;
                log('Retrieved [Teams] from remote data source', s, true);
                return teamsObservable(s);
            }
        };

        var getTeamNews = function (team) {            
            var parameters = makeParameters();
            var query = breeze.EntityQuery
                .from("teams/" + team.id() + "/news")
                .withParameters(parameters);

            return manager.executeQuery(query).then(querySucceeded).fail(queryFailed);

            function querySucceeded(data) {
                var s = data.results;
                var tempObs = ko.observableArray(s);
                // Since the news item has multiple categories and can be for multiple teams
                // we will set the team explicitly to the team we are searching for.
                // We could set it to each team, but this is a simple example.
                ko.utils.arrayForEach(tempObs(), function (newsitem) {
                    newsitem.teamId(team.id());
                });
                log('Retrieved [News] from remote data source', s, true);
                return true;
            }
        };

        function makeParameters(addlParameters) {
            // All of the API calls will need an apikey parameter set
            var parameters = {
                apikey: myAPIKEY
            };
            // If there are any additional parameters, those will be extended
            return breeze.core.extend(parameters, addlParameters);
        }

        function returnResults(data) {
            return data.results;
        }

        // Expose the methods
        var datacontext = {
            getTeams: getTeams,
            getTeamNews: getTeamNews
        };

        return datacontext;

        function getLocal(resource, entityType, ordering) {
            var query = EntityQuery.from(resource)
                .toType(entityType)
                .orderBy(ordering);
            return manager.executeQueryLocally(query);
        }

        function queryFailed(error) {
            var msg = 'Error retrieving data. ' + error.message;
            logger.logError(msg, error, 'datacontext', true);
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, 'datacontext', showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, 'datacontext', true);
        }
    });