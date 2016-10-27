module.exports = function () {

var sys = require('sys');
var exec = require('child_process').exec;
var read = require('read');
var fs = require('fs');
var curfolder = "";
var curfile = "";

var options = {
	prompt: 'enter pass: ',
	silent: true,
	replace: '*'
};

read(options, function (error, result, isDefault) {
		
	//testlogin("friedcook", result);
	//createproj("friedcook", result, "test");

	//clone(projlist[2].html_url, projlist[2].name);
	
	createproj("friedcook", result, "test");
	var projlist = listproj("friedcook");
	for (var i = 0; i < projlist.length; i++) console.log(projlist[i].name);
	clone(projlist[0].html_url, projlist[0].name);
	pull();
	newfile("test.java");
	add("test.java");
	push();
});

function puts(error, stdout, stderr) { sys.puts(stdout) }

function testlogin(user, pass) {
	exec("curl -u " + user + ":" + pass + " https://api.github.com", function (error, stdout, stderr) {
		fs.writeFile("out.txt", stdout, null);
	});
	out = fs.readFileSync("out.txt", "utf8");

	var obj = JSON.parse(out);
	if (obj.message)
		return true;
	return false;
}

function createproj(user, pass, name) {
	exec("curl -i -u " + user + ":" + pass + " -d \'{\"name\":\"" + name + "\"}\' -X POST https://api.github.com/user/repos", puts);
}

function clone(url) {
	exec("git clone " + url, puts);
}

function pull() {
	exec("cd " + curfolder + " && git pull", puts);
}

function add(filename) {
	exec("cd " + curfolder + " && git add " + filename, puts);
}

function commit(message) {
	exec("cd " + curfolder + " && git commit -m \"" + message + "\"");
}

function newfile(filename) {
	exec("cd " + curfolder + " && touch " + filename, puts);
	setcurfile(filename);
}

function push () {
	exec("cd " + curfolder + " && git push origin master", puts);
}

function compile() {
	exec("javac " + curfolder + "/*.java", puts);
}

function run(prog, args) {
	exec("java " + curfolder + "/" + prog + args, puts);
}

function listproj(user) {

	exec("curl https://api.github.com/users/" + user + "/repos", function (error, stdout, stderr) {
		fs.writeFile("out.txt", stdout, null);
	});
	out = fs.readFileSync("out.txt", "utf8");

	var obj = JSON.parse(out);
	return obj;
}

function setcurfolder(filename) {
	curfolder = filename;
}

function setcurfile(filename) {
	curfile = filename;
}

}
