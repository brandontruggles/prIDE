function parseGithubCode()
{
	var search = window.location.search;
	window.opener.fn.processAuth(search);
	window.close();
}
