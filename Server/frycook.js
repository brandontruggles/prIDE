
function gh_login(user, pass) {
	curl -i "https://api.github.com" -u "$user":"$pass";
	//401/403 mean failed
}

function gh_push() {
}
