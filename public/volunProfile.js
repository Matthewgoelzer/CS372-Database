
document.getElementById("volSignInButton").addEventListener('click', function (event) {
	console.log("here2");
	var req = new XMLHttpRequest();       
	var dataSend =  {name:null};
	dataSend.name = document.getElementById('volSignInBar').value || null;
	// console.log(dataSend.name);
	if(dataSend.name=== null) {
		alert("Search cannot be null");
		event.preventDefault();
		return;
	}
	req.open("POST", "/VolSignIn", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log(req.responseText);
			if(req.responseText == '[]'){
				alert("No Volunteer Found");
			}
			else {
				var volRes = JSON.parse(req.responseText);
				console.log(volRes);

                makeVolAppHistTable(volRes, dataSend.name);
				makeVolJobHistTable(volRes);
				document.getElementById("volNameInfo").textContent = volRes.volInfo[0].volunteer_Name;
				document.getElementById("volIDInfo").textContent = volRes.volInfo[0].volunteer_ID;
				document.getElementById("volEmailInfo").textContent = volRes.volInfo[0].volunteer_Email;
				document.getElementById("volDOBInfo").textContent = volRes.volInfo[0].volunteer_DOB;
				document.getElementById("volLocInfo").textContent = volRes.volInfo[0].location;
			}
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	console.log(dataSend);
	req.send(JSON.stringify(dataSend));
	event.preventDefault();
});

function makeVolAppHistTable(responseObj, volunteer) {
	
	var appHist = responseObj.volAppHist;
	console.log(appHist);
	//delete old table
	document.getElementById("appHistTable").removeChild(document.getElementById("bodyAppHistTable"));
	//amke new table 
	var bodyT = document.createElement('tbody');
	bodyT.id = "bodyAppHistTable";
	document.getElementById("appHistTable").appendChild(bodyT);
	//make a row for each row in returned Json data
	appHist.forEach(function(row) {
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

		//make remove app button
		var deleteCell = document.createElement("td")
		deleteCell.id = "deleteApp"+ row["job_ID"]
		var deleteBtn = document.createElement('button');
		deleteBtn.id = "deleteAppBtn"+ row["job_ID"];
		deleteBtn.className = "btn btn-primary";
		deleteCell.appendChild(deleteBtn);
		newRow.appendChild(deleteCell);
		deleteBtn.textContent = "Remove Application";
		
		//add row
		bodyT.appendChild(newRow);
		document.getElementById("deleteAppBtn" + row["job_ID"]).addEventListener("click", function () {
			deleteJobAppForm(event, volunteer);
		});

	})
};


function deleteJobAppForm(event, volName) {
	var req = new XMLHttpRequest();
	
	console.log(volName);
    var deleteSend = {job_ID:null, name:null};
	deleteSend.job_ID = event.target.parentElement.parentElement.id
	deleteSend.name = volName
//    console.log(deleteSend)
    req.open("POST", '/DeleteVolApp', true);
	req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			// console.log(JSON.parse(req.responseText));
            makeVolAppHistTable(JSON.parse(req.responseText), volName);
		}
		else {
    		console.log("Error in network request: " + req.statusText);
  		}
	});
    req.send(JSON.stringify(deleteSend));
    event.preventDefault();

}


function makeVolJobHistTable(responseObj) {
	
	var jobHist = responseObj.volJobHist;
	console.log(jobHist);
	//delete old table
	document.getElementById("jobHistTable").removeChild(document.getElementById("bodyjobHistTable"));
	//amke new table 
	var bodyT = document.createElement('tbody');
	bodyT.id = "bodyjobHistTable";
	document.getElementById("jobHistTable").appendChild(bodyT);
	//make a row for each row in returned Json data
	jobHist.forEach(function(row) {
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

		// var approved1 = document.createElement("td");
        // approved1.id = "approved"+ row["job_ID"];
        // if(row["approved"] == 1) {
        //     approved1.textContent = "Approved";
		// }
		// else {
		// 	approved1.textContent = "Not Approved";
		// }
		// newRow.appendChild(approved1);
		
		//add row
		bodyT.appendChild(newRow);
		// document.getElementById("applyBtn" + row["job_ID"]).addEventListener("click", makeApplyForm);
		// document.getElementById("deleteBtn" + row["id"]).addEventListener("click", deleteRow);

	})
};