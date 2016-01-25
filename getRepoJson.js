var Db = require('tingodb')().Db
var db = new Db('./db', {});
var repos = db.collection("repos");

repos.find({}).count(function(err, count) {
	repos.find({}, {_id: 0, full_name: 1, description: 1, 
					url: 1, avatar_url: 1, stargazers_count: 1}).sort({"stargazers_count": -1})
		.toArray(function(err, result) {
			console.log(JSON.stringify({count: count, created: new Date(), repos: result}));
		})
})