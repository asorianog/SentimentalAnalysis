//includes
var util = require('util'),
    twitter = require('twitter'),
    sentimentAnalysis = require('./sentimentAnalysis'),
    db = require('diskdb');

db = db.connect('db', ['sentiments']);
//config

var config = {
  consumer_key: '80flQ8ntlUQdS1cgnrIx9ZSfD',
  consumer_secret: 'g8adps5lPGWk9n6KqpfLvJvxnoDdHmqQH88sdXW4lxIgEJq9C9',
  access_token_key: '799676978815041536-TcerA6gd27RhlCC8ZGNU9u0q3V6lq6I',
  access_token_secret: 'VPRd1iQ78L4RvoOurjz3qsDBYjazKTxBqrzrS6qSNX8TR'
};

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment

  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};

      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        tweet: resp.tweet.text,
        score: resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}