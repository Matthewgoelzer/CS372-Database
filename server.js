var express = require('express');
var app = express();
var bodyPar = require('body-parser');
var mysql = require('./dbcon.js');
app.use(express.static('public'));
var port = process.env.PORT || 7630
app.use(bodyPar.urlencoded({extended: false}));
app.use(bodyPar.json());

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/SearchLoaded', function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM job_Postings', function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        console.log(context.results);
        res.send(JSON.stringify(rows));
    });
});
app.post("/jobApply", function(req, res) {
    // get data from forms and add to the table called user..

    var reqBody = req.body;
    console.log(reqBody);
    var name = reqBody.volunteer_Name;
    var job_id = reqBody.job_ID;

    mysql.pool.query('INSERT INTO `job_Applicants` (`volunteer_ID`, `job_ID`, `approved`) VALUES ((SELECT volunteer_ID FROM volunteer_Profiles WHERE volunteer_Name = ?), ?, "0")', 
    [name, job_id],function (err, result) {
    if (err) {
        // Throw your error output here.
        console.log("An error occurred.");
    } else {
        // Throw a success message here.
        console.log("1 record successfully inserted into db");
    }
    });
});
app.post('/Search', function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM `job_Postings` WHERE job_Title =?', [req.body.search], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = JSON.stringify(rows);
        console.log(context.results);
        res.send(JSON.stringify(rows));
    });
});

app.listen(port, function() {
    console.log("running");
});
