var fs = require('fs');

var monthNames = [
  "Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct",
  "Nov", "Dec"
];

fs.readFile('./processing/index.tmpl.html', 'utf8', function(err, template) {	
	fs.readFile('./processing/repos.json', 'utf8', function(err, reposStr) {
		repos = JSON.parse(reposStr);
		template = template.replace('**count**', repos.count.toLocaleString());

		var updatedOn = new Date(repos.updatedOn);
		updatedOnStr = monthNames[updatedOn.getMonth()] + ' ' + updatedOn.getDate() + ', ' + updatedOn.getFullYear();
		
		template = template.replace('**updatedOn**', updatedOnStr);

		reposStr = ''
		repos.repos.forEach(function(repo) {
			var createdDate = new Date(repo.created_at);
			var createdStr = monthNames[createdDate.getMonth()] + ' ' + createdDate.getFullYear(); 
			reposStr += `<tr> 
					      <td><a href="**url**">**name**</a></td> 
					      <td>**stars**</td> 
					      <td>**created**</td> 
					      <td>**description**</td> 
					    </tr>`
					    .replace('**url**', repo.html_url)
					    .replace('**name**', repo.name)
					    .replace('**stars**', repo.stargazers_count.toLocaleString())
					    .replace('**created**', createdStr)
					    .replace('**description**', repo.description);
		});

		template = template.replace('**repos**', reposStr);
		console.log(template);
	})
	
})