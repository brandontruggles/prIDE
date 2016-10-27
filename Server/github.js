var sys = require('sys');
var exec = require('child_process').exec;
var read = require('read');

var options = {
	prompt: 'enter pass: ',
	silent: true,
	replace: '*'
};

read(options, function (error, result, isDefault) {
		
	//testLogin("friedcook", result);
	//createProj("friedcook", result, "test");
	//listProj("friedcook");
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
			
			var obj = JSON.parse(stdout);
			for (var i = 0; i < obj.length; i++) {
				console.log(obj[i].name);
			}
		
		});
}

function pull(repo) {
	;
}
