var GitHubApi = require("github");

var github = new GitHubApi({
      version: "3.0.0",
      protocol: "https",
      host: "api.github.com",
      timeout: 5000,
      headers: {
          "user-agent": "checklistomania" 
      }
  });

github.authenticate({
      type: "oauth",
      key: process.env.GITHUB_CLIENT_ID,
      secret: process.env.GITHUB_CLIENT_SECRET
});

var Db = require('tingodb')().Db
var db = new Db('./db', {});
var repos = db.collection("repos");
repos.ensureIndex('url', function() {});
repos.remove({});

var getRepos = function(min, max, page) {
	console.log('page: ' + page);
	var query = 'stars:"' + min + ' .. ' + max + '"';
	console.log(query);
	github.search.repos({q: query, per_page: 100, page: page}, 
	function(err, data) {
		if (err) {console.log(err); setTimeout(function() {
			getRepos(min, max, page);
		}, 65000)} 
		else {
			if(data.total_count > 1000) {console.log("ERROR: MAX LIMIT REACHED");}
			else {
				data.items.forEach(function(item) {
					repos.update({url: item.url}, item, {upsert: true});
				});
				console.log('total count: ' + data.total_count);

				if(((page+1)*100 / data.total_count) < 1) {
					getRepos(min, max, page + 1);
				} else {
					var diff = max - min;
					min = max;
					max = max + Math.floor(diff*1.4);

					if(max > 10000) {max = 1000000}
					if(min < 1000000) {
						getRepos(min, max, 0);
					}
				}
			}
		};
});
};

getRepos(1000, 1100, 0)
