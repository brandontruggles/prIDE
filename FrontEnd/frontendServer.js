var express = require('express');
var opn = require('opn');
var path = require('path');
var app = express();


app.get('/*', function(req,res){
  res.sendFile(path.join(__dirname,'../', 'index.html'));
});

app.use(express.static(path.join(__dirname,'css')));
app.use(express.static(path.join(__dirname,'js')));

app.listen(9000, 'localhost', function (err){ 
  if(err){
    return console.error(err);
  }
  console.log('listening at http://localhost:9000');
  opn('http://localhost:9000');
})
