define(['configuration'], function (config) {

    var DT = breeze.DataType;

    var model = {
        initialize: initialize
    };
    return model;

    function initialize(metadataStore) {

        metadataStore.addEntityType({
            shortName: "NewsItem",
            namespace: "ESPN",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                teamId: { dataType: "Int64" },
                headline: { dataType: "String" },
                description: { dataType: "String" },
                source: { dataType: "String" },
                imageSource: { dataType: "String" },
                imageCaption: { dataType: "String" },
                imageCredit: { dataType: "String" },
                link: { dataType: "String" }
            },
            navigationProperties: {
                team: {
                    entityTypeName: "Team", isScalar: true,
                    associationName: "Team_NewsItems", foreignKeyNames: ["teamId"]
                }
            }
        });

        metadataStore.addEntityType({
            shortName: "Team",
            namespace: "ESPN",
            dataProperties: {
                id: { dataType: "Int64", isPartOfKey: true },
                location: { dataType: "String" },
                name: { dataType: "String" },
                abbreviation: { dataType: "String" },
                color: { dataType: "String" }
            },
            navigationProperties: {
                newsItems: {
                    entityTypeName: "NewsItem", isScalar: false,
                    associationName: "Team_NewsItems"
                }
            }
        });

        metadataStore.registerEntityTypeCtor(
            'Team', null, teamInitializer);

        function teamInitializer(team) {
            team.fullName = ko.computed(function () {
                var loc = team.location();
                var name = team.name();
                return loc + ' ' + name;
            });
            // Make an observable to decide whether to show the team's news.
            team.showNews = ko.observable(false);
        }
    }
});