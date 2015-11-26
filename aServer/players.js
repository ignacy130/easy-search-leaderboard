// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

PlayersIndex = new EasySearch.Index({
    engine: new EasySearch.MongoDB({
        sort: function () {
            return {
                score: -1
            };
        },
        selector: function (searchObject, options, aggregation) {
            let selector = this.defaultConfiguration().selector(searchObject, options, aggregation),
                categoryFilter = options.search.props.categoryFilter;

            if (_.isString(categoryFilter) && !_.isEmpty(categoryFilter)) {
                selector.category = categoryFilter;
            }

            return selector;
        }
    }),
    collection: Players,
    fields: ['name'],
    defaultSearchOptions: {
        limit: 8
    },
    permission: () => {
        //console.log(Meteor.userId());

        return true;
    }
});

Meteor.methods({
    updateScore: function (playerId) {
        check(playerId, String);
        Players.update(playerId, {
            $inc: {
                score: 5
            }
        });
    }
});

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
    var first_names = [
      "Ada",
      "Grace",
      "Marie",
      "Carl",
      "Nikola",
      "Claude",
      "Peter",
      "Stefan",
      "Stephen",
      "Lisa",
      "Christian",
      "Barack"
    ],
        last_names = [
      "Lovelace",
      "Hopper",
      "Curie",
      "Tesla",
      "Shannon",
      "Müller",
      "Meier",
      "Miller",
      "Gaga",
      "Franklin"
    ],
        categories = ["Genius", "Geek", "Hipster", "Idler"];;

    Meteor.startup(function () {
        if (Players.find().count() < 100) {
            // ten thousand docs
            for (var i = 0; i < 10 * 1000; i++) {
                console.log(i + ' doc indexed');
                Players.insert({
                    name: Random.choice(first_names) + ' ' + Random.choice(last_names),
                    score: Math.floor(Random.fraction() * 1000 / Random.fraction() / 100),
                    category: Random.choice(categories)
                });
            }

            console.log('done!');
        }
    });
}1