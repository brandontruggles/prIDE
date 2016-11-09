
var Sync = require('sync');

function test() {
	for (var i = 0; i < 1000; i++)
		console.log(i);
}

Sync(function() {test(); test();});
