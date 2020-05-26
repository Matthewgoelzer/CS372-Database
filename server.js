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
        console.log(context);
        if(context.results == '[]') {
            mysql.pool.query('SELECT * FROM `job_Postings` WHERE organization_ID = (SELECT organization_ID FROM `nonprofit_Organizations` WHERE organization_Name =?)', [req.body.search], function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
                context.results = JSON.stringify(rows);
                console.log(context.results);
               
                res.send(JSON.stringify(rows));
              
                    
            });
        }
        else{
            res.send(JSON.stringify(rows));
        }
       
    });
});

app.post('/NewVolP', function(req,res,next){
    // get data from forms and add to the table called user..
    mysql.pool.query('INSERT INTO `volunteer_Profiles` (`volunteer_ID`, `volunteer_Name`, `volunteer_Email`, `volunteer_DOB`, `location`) VALUES (NULL, ?, ?, ?, ?)', 
    [ req.body.volunteer_Name, req.body.volunteer_Email, req.body.volunteer_DOB, req.body.location], function (err, result) {
        if (err) {
            // Throw your error output here.
            console.log("An error occurred.");
        } else {
            // Throw a success message here.
            console.log("1 record successfully inserted into db");
        }
    });
});

app.post('/NewOrgP', function(req,res,next){
    // get data from forms and add to the table called user..
    console.log(req.body);
    mysql.pool.query('INSERT INTO `nonprofit_Organizations` (`organization_Name`, `organization_ID`) VALUES (?, NULL)', 
    [req.body.organization_Name], function (err, result) {
        if (err) {
            // Throw your error output here.
            console.log("An error occurred.");
        } else {
            // Throw a success message here.
            console.log("1 record successfully inserted into db");
        }
    });
});

app.post('/NewJob', function(req,res,next){
    // get data from forms and add to the table called user..
    console.log(req.body);
    mysql.pool.query('INSERT INTO `job_Postings` (`job_Title`, `job_ID`, `organization_ID`) VALUES (?, NULL, (SELECT organization_ID FROM nonprofit_Organizations WHERE organization_Name = ?))', 
    [req.body.job_Title, req.body.organization_Name], function (err, result) {
        if (err) {
            // Throw your error output here.
            console.log("An error occurred.");
        } else {
            // Throw a success message here.
            console.log("1 record successfully inserted into db");
        }
    });
});

app.post('/DeleteVolApp',function(req,res,next){
    //delete row with id
    var context = {};
    mysql.pool.query("DELETE FROM `job_Applicants` WHERE job_ID=? AND volunteer_ID = (SELECT volunteer_ID FROM `volunteer_Profiles` WHERE volunteer_Name = ?)", [req.body.job_ID, req.body.name], function(err, result){
        if(err){
            next(err);
            return;
        }
    
    mysql.pool.query('SELECT job_Postings.job_Title, job_Applicants.job_ID FROM `job_Applicants` INNER JOIN `job_Postings` ON job_Applicants.job_ID = job_Postings.job_ID WHERE volunteer_ID = (SELECT volunteer_ID FROM `volunteer_Profiles` WHERE volunteer_Name = ?)', [req.body.name], function(err, rows){
        if(err){
            next(err);
            return;
        }
        context.volAppHist = rows;
        res.send(JSON.stringify(context));
     });
    });
});

app.post('/DeleteOrgJob',function(req,res,next){
    //delete row with id
    var context = {};
    mysql.pool.query("DELETE FROM `job_Postings` WHERE job_ID=?", [req.body.job_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
    
        mysql.pool.query('SELECT job_Title, job_ID, organization_ID FROM `job_Postings`  WHERE organization_ID = (SELECT organization_ID FROM `nonprofit_Organizations` WHERE organization_Name = ?)', [req.body.name], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.orgJobs = rows;
            console.log(context);
            res.send(JSON.stringify(context));
        });
    });
});

app.post('/VolSignIn', function(req,res,next){
    var context = {};
    
    mysql.pool.query('SELECT job_Postings.job_Title, job_Applicants.job_ID FROM `job_Applicants` INNER JOIN `job_Postings` ON job_Applicants.job_ID = job_Postings.job_ID WHERE volunteer_ID = (SELECT volunteer_ID FROM `volunteer_Profiles` WHERE volunteer_Name = ?)', [req.body.name], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.volAppHist = rows;
        
        mysql.pool.query('SELECT * FROM `volunteer_Profiles` WHERE volunteer_ID = (SELECT volunteer_ID FROM `volunteer_Profiles` WHERE volunteer_Name = ?)', [req.body.name], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.volInfo = rows;
        
            mysql.pool.query('SELECT job_Title, job_ID FROM `volunteer_Histories` WHERE volunteer_ID = (SELECT volunteer_ID FROM `volunteer_Profiles` WHERE volunteer_Name = ?)', [req.body.name], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            
            context.volJobHist = rows;
            context.req = req.body;
            console.log(context);
            res.send(JSON.stringify(context));
        });
    });
    });
});

app.post('/OrgSignIn', function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT job_Title, job_ID, organization_ID FROM `job_Postings`  WHERE organization_ID = (SELECT organization_ID FROM `nonprofit_Organizations` WHERE organization_Name = ?)', [req.body.name], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.orgJobs = rows;
        
        
       
    });
    mysql.pool.query('SELECT organization_ID FROM `nonprofit_Organizations` WHERE organization_Name = ?', [req.body.name], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.orgInfo = rows;
        res.send(JSON.stringify(context));
    });
});

app.post('/OrgJobApps', function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT job_Applicants.volunteer_ID, volunteer_Profiles.volunteer_Name, job_Applicants.approved FROM `job_Applicants` INNER JOIN `volunteer_Profiles` ON job_Applicants.volunteer_ID = volunteer_Profiles.volunteer_ID WHERE job_ID = ?', [req.body.job_ID], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.orgJobs = rows;
        console.log(context);
        res.send(JSON.stringify(context));
    });
});

app.post('/UpdateApp',function(req,res,next){
    //delete row with id
    var context = {};
    mysql.pool.query("UPDATE `job_Applicants` SET approved = ? WHERE job_ID=? AND volunteer_ID = ?", [req.body.approved, req.body.job_ID, req.body.volunteer_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
        if(req.body.approved == 1) {
            mysql.pool.query('INSERT INTO `volunteer_Histories` (`volunteer_ID`, `job_ID`, `job_Title`) VALUES (?, ?, (SELECT job_Title FROM `job_Postings` WHERE job_ID = ?))', [req.body.volunteer_ID,  req.body.job_ID, req.body.job_ID],function (err, result) {
                if (err) {
                    // Throw your error output here.
                    console.log("An error occurred.");
                } else {
                    // Throw a success message here.
                    console.log("1 record successfully inserted into db");
                }
            });
        }
        else {
            if(mysql.pool.query('SELECT * FROM `volunteer_Histories`  WHERE volunteer_ID = ? AND job_ID = ?', [req.body.volunteer_ID,  req.body.job_ID],function (err, result) {})) {
                mysql.pool.query('DELETE FROM `volunteer_Histories`  WHERE volunteer_ID = ? AND job_ID = ?', [req.body.volunteer_ID,  req.body.job_ID],function (err, result) {
                    if (err) {
                        // Throw your error output here.
                        console.log("An error occurred.");
                    } else {
                        // Throw a success message here.
                        console.log("1 record successfully inserted into db");
                    }
                });
            }
        }
        mysql.pool.query('SELECT job_Applicants.volunteer_ID, volunteer_Profiles.volunteer_Name, job_Applicants.approved FROM `job_Applicants` INNER JOIN `volunteer_Profiles` ON job_Applicants.volunteer_ID = volunteer_Profiles.volunteer_ID WHERE job_ID = ?', [req.body.job_ID], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            context.orgJobs = rows;
            console.log(context);
            res.send(JSON.stringify(context));
        });
    });
});

app.listen(port, function() {
    console.log("running");
});
