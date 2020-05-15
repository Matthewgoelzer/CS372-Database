var express = require('express');
var app = express();

var port = process.env.PORT || 7629

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get("/jobsAndSearch.html", function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/jobsAndSearch.html',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM job_Postings', function(err, rows, fields){
    if(err){
        next(err);
        return;
    }
    context.results = JSON.stringify(rows);

    res.send(context);
    });
});


app.listen(port, function() {
    console.log("running");
})
