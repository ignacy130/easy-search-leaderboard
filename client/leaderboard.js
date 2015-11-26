Meteor.methods({
  updateScore: function (playerId) {
    check(playerId, String);
    Players.update(playerId, { $inc: { score: 5 }});
  }
});

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    inputAttributes: function () {
      return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
    },
    players: function () {
      return Players.find({}, { sort: { score: -1, name: 1 } });
    },
    selectedName: function () {
      var player = PlayersIndex.config.mongoCollection.findOne({ __originalId: Session.get("selectedPlayer") });
      return player && player.name;
    },
    index: function () {
      return PlayersIndex;
    },
    resultsCount: function () {
      return PlayersIndex.getComponentDict().get('count');
    },
    showMore: function () {
      return false;
    },
    renderTmpl: () => Template.renderTemplate
  });

  Template.leaderboard.events({
    'click .inc': function () {
      Meteor.call('updateScore', Session.get("selectedPlayer"));
    },
    'change .category-filter': function (e) {
      PlayersIndex.getComponentMethods()
        .addProps('categoryFilter', $(e.target).val())
      ;
    }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this.__originalId) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selectedPlayer", this.__originalId);
    }
  });

  Tracker.autorun(() => {
    console.log(PlayersIndex.search('Barack', { limit: 20 }).fetch());
  });

  Tracker.autorun(() => {
    console.log(PlayersIndex.search('Barack', { limit: 20 }).fetch());
  });
}

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
}
