
var execFileSync = require('child_process').execFileSync;
console.log(execFileSync("pwd", {"cwd": "workspace"}).toString());
