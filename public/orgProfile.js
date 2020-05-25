document.getElementById("orgBackButton").addEventListener('click', function (event) {
	var req = new XMLHttpRequest();       
	var dataSend =  {name:null};
	dataSend.name = document.getElementById('orgName').textContent || null;
	console.log(dataSend.name);
	if(dataSend.name=== null) {
		alert("Search cannot be null");
		event.preventDefault();
		return;
	}
	req.open("POST", "/OrgSignIn", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log(req.responseText);
			if(req.responseText == '[]'){
				alert("No Volunteer Found");
			}
			else {
                makeOrgJobTable(JSON.parse(req.responseText), dataSend.name);
			}
			
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	// console.log(dataSend);
	req.send(JSON.stringify(dataSend));
	event.preventDefault();
});


document.getElementById("orgSignInButton").addEventListener('click', function (event) {
	var req = new XMLHttpRequest();       
	var dataSend =  {name:null};
	dataSend.name = document.getElementById('orgSignInBar').value || null;
	if(dataSend.name=== null) {
		alert("Search cannot be null");
		event.preventDefault();
		return;
	}
	req.open("POST", "/OrgSignIn", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			if(req.responseText == '[]'){
				alert("No Volunteer Found");
			}
			else {
                var orgData = JSON.parse(req.responseText);
                makeOrgJobTable(orgData, dataSend.name);
                document.getElementById("orgName").textContent = dataSend.name;
                var orgID = orgData.orgJobs[0].organization_ID;
                document.getElementById("orgIDNum").textContent = orgID;
                console.log(orgID);
			}
			
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	// console.log(dataSend);
	req.send(JSON.stringify(dataSend));
	event.preventDefault();
});

function makeOrgJobTable(responseObj, organization) {
	var orgJob = responseObj.orgJobs;
	console.log(organization);
	//delete old table
	document.getElementById("orgJobTable").removeChild(document.getElementById("bodyOrgJobTable"));
    
    document.getElementById("orgJobTable").removeChild(document.getElementById("headOrgJobTable"));
	//amke new table 
	var headT = document.createElement('thead');
    headT.id = "headOrgJobTable";
    var headR = document.createElement('tr');
    var colID = document.createElement("th");
    var colName = document.createElement("th");
    var colApp = document.createElement("th");
    var colBlank = document.createElement("th");
    colID.textContent = "Job ID";
    colName.textContent = "Job Name";
    colApp.textContent = "Applicants";
    headR.appendChild(colID);
    headR.appendChild(colName);
    headR.appendChild(colApp);
    headR.appendChild(colBlank);
    headT.appendChild(headR);
	document.getElementById("orgJobTable").appendChild(headT);
    //make new table 
	var bodyT = document.createElement('tbody');
	bodyT.id = "bodyOrgJobTable";
	document.getElementById("orgJobTable").appendChild(bodyT);
	//make a row for each row in returned Json data
	orgJob.forEach(function(row) {
		var newRow = document.createElement("tr");
		newRow.id = row["job_ID"];

		var jobTitle1 = document.createElement("td");
		jobTitle1.id = "job_Title"+ row["job_ID"]
		jobTitle1.textContent = row["job_Title"];
		newRow.appendChild(jobTitle1);

		var jobID1 = document.createElement("td");
		jobID1.id = "job_ID"+ row["job_ID"]
		jobID1.textContent = row["job_ID"];
		newRow.appendChild(jobID1);

        //make view applciants button
		var appsCell = document.createElement("td")
		appsCell.id = "apps"+ row["job_ID"]
		var appsBtn = document.createElement('button');
		appsBtn.id = "appsBtn"+ row["job_ID"];
		appsBtn.className = "btn btn-primary";
		appsCell.appendChild(appsBtn);
		newRow.appendChild(appsCell);
		appsBtn.textContent = "Go";

		//make remove app button
		var deleteCell = document.createElement("td")
		deleteCell.id = "deleteJob"+ row["job_ID"]
		var deleteBtn = document.createElement('button');
		deleteBtn.id = "deleteJobBtn"+ row["job_ID"];
		deleteBtn.className = "btn btn-primary";
		deleteCell.appendChild(deleteBtn);
		newRow.appendChild(deleteCell);
		deleteBtn.textContent = "Remove Job";
		
		//add row
		bodyT.appendChild(newRow);
		document.getElementById("deleteJobBtn" + row["job_ID"]).addEventListener("click", function () {
			deleteJobForm(event,organization);
        });
        document.getElementById("appsBtn" + row["job_ID"]).addEventListener("click", function () {
            console.log("here3");
            var req = new XMLHttpRequest();       
            var dataSend =  {job_ID:null};
            dataSend.job_ID = event.target.parentElement.parentElement.id;
            req.open("POST", "/OrgJobApps", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    console.log(req.responseText);
                    if(req.responseText == '[]'){
                        alert("No Volunteer Found");
                    }
                    else {
                        makeAppsTable(JSON.parse(req.responseText));
                    }
                    
                }
                else {
                    console.log("Error in network request: " + req.statusText);
                }
            });
            // console.log(dataSend);
            req.send(JSON.stringify(dataSend));
            event.preventDefault();            
            
            
		});

	})
};


function deleteJobForm(event, volName) {
	var req = new XMLHttpRequest();
	var url = '?id=';
	var name = '&name=' + volName;
	console.log(volName);
    var deleteSend = null;
    deleteSend = event.target.parentElement.parentElement.id
   console.log(deleteSend)
    req.open("delete", '/DeleteVolApp' + url + deleteSend + name, true);
  	
    req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
            // makeVolAppHistTable(JSON.parse(req.responseText),volName);
		}
		else {
    		console.log("Error in network request: " + req.statusText);
  		}
	});
 
    req.send(null);
    event.preventDefault();

}

function makeAppsTable(responseObj) {
	var apps = responseObj.orgJobs;
	//delete old table
	document.getElementById("orgJobTable").removeChild(document.getElementById("bodyOrgJobTable"));
	//amke new table 
	var bodyT = document.createElement('tbody');
	bodyT.id = "bodyOrgJobTable";
	document.getElementById("orgJobTable").appendChild(bodyT);
    
    document.getElementById("orgJobTable").removeChild(document.getElementById("headOrgJobTable"));
	//amke new table 
	var headT = document.createElement('thead');
    headT.id = "headOrgJobTable";
    var headR = document.createElement('tr');
    var colID = document.createElement("th");
    var colName = document.createElement("th");
    var colApprove = document.createElement("th");
    var colBlank = document.createElement("th");
    colID.textContent = "volunteer ID";
    colName.textContent = "volunteer Name";
    colApprove.textContent = "Approve Applicant";
    headR.appendChild(colID);
    headR.appendChild(colName);
    headR.appendChild(colApprove);
    headR.appendChild(colBlank);
    headT.appendChild(headR);
	document.getElementById("orgJobTable").appendChild(headT);
    
    //make a row for each row in returned Json data
	apps.forEach(function(row) {
		var newRow = document.createElement("tr");
		newRow.id = row["job_ID"];

		var volID1 = document.createElement("td");
		volID1.id = "volID"+ row["job_ID"]
		volID1.textContent = row["volunteer_ID"];
		newRow.appendChild(volID1);

        var volName1 = document.createElement("td");
		volName1.id = "volName"+ row["job_ID"]
		volName1.textContent = row["volunteer_Name"];
		newRow.appendChild(volName1);

        var approve1 = document.createElement('input');
		approve1.id = "approve"+ row["job_ID"]
        approve1.type = "checkbox";
        if(row["approved"] == 1) {
            approve1.checked = 1;
        }
        else {
            approve1.checked = 0;
        }
        newRow.appendChild(approve1);
        
        //make view applciants button
		var updateCell = document.createElement("td")
		updateCell.id = "update"+ row["job_ID"]
		var updateBtn = document.createElement('button');
		updateBtn.id = "updateBtn"+ row["job_ID"];
		updateBtn.className = "btn btn-primary";
		updateCell.appendChild(updateBtn);
		newRow.appendChild(updateCell);
		updateBtn.textContent = "Update";

		
		//add row
		bodyT.appendChild(newRow);
		
        document.getElementById("updateBtn" + row["job_ID"]).addEventListener("click", function () {
			
        });
        

    });
    
};