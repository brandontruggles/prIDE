function parseGithubCode()
{
	var hash = window.location.hash;
	console.log(hash);
	window.opener.fn.processAuth(hash);
}
