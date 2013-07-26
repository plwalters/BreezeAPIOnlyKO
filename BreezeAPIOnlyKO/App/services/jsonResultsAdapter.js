/* jsonResultsAdapter: parses data into entities */
define([], new breeze.JsonResultsAdapter({

    name: "ESPN",

    extractResults: function (data) {
        var results = data.results;
        if (!results) throw new Error("Unable to resolve 'results' property");
        //Only return results if they are a headline or a team.
        return results && (results.headlines || results.sports[0].leagues[0].teams);
    },

    visitNode: function (node, mappingContext, nodeContext) {
        if (node.name) {
            // If the returned data in the node has a name property
            // then it is a Team, because we are only getting teams and news
            return { entityType: "Team" };
        }
        else if (node.headline) {
            // If the returned item has a headline, then it is news.
            // If there are any images then set the first one as the default
            // picture, and if not show a blank picture
            if (node.images.length > 0) { 
                node.imageSource = node.images[0].url;
                node.imageCaption = node.images[0].caption;
                node.imageCredit = node.images[0].credit;
            }
            else {
                node.imageSource = '../content/images/blank_image.png';
                node.imageCaption = 'none';
                node.imageCredit = 'no credit';
            }
            // Give the news item a link back to the original story
            node.link = node.links.web.href;
            return { entityType: "NewsItem" };
        }
    }
}));