var Db = require('tingodb')().Db
var db = new Db('./processing/db', {});
var repos = db.collection("repos");

repos.find({}).count(function(err, count) {
	repos.find({}, {_id: 0, name: 1, description: 1, created_at: 1,
					html_url: 1, avatar_url: 1, stargazers_count: 1}).sort({"stargazers_count": -1})
		.toArray(function(err, result) {
			console.log(JSON.stringify({count: count, updatedOn: new Date(), repos: result}));
		})
})