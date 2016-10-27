var sys = require('sys');
var exec = require('child_process').exec;
var read = require('read');
var fs = require('fs');

var options = {
	prompt: 'enter pass: ',
	silent: true,
	replace: '*'
};

read(options, function (error, result, isDefault) {
		
	//testLogin("friedcook", result);
	//createProj("friedcook", result, "test");
	var obj = listProj("brandonrninefive");
	for (var i = 0; i < obj.length; i++) console.log(obj[i].name);
	//clone(obj[2].url);
});


function puts(error, stdout, stderr) { sys.puts(stdout) }

function testLogin(user, pass) {
		exec("curl -u " + user + ":" + pass + " https://api.github.com", puts);
}

function createProj(user, pass, name) {
		exec("curl -i -u " + user + ":" + result + " -d \'{\"name\":\"" + name + "\"}\' -X POST https://api.github.com/user/repos", null);
}

function listProj(user) {

	exec("curl https://api.github.com/users/" + user + "/repos", function (error, stdout, stderr) {
		fs.writeFile("out.txt", stdout, null);
	});
	out = fs.readFileSync("out.txt", "utf8");

	var obj = JSON.parse(out);
	return obj;
}

function clone(url) {
	exec("git clone " + repo, null);
}

function pull(url) {
	exec("git pull" + repo, null);
}

function add(filename) {
	exec("git add " + filename, null);
}
