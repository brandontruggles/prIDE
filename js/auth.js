function parseGithubCode()
{
	var search = window.location.search;
	console.log(search);
	window.opener.fn.processAuth(search);
	window.opener.alert(search);
}
