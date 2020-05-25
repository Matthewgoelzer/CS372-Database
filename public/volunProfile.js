
document.getElementById("volSignInButton").addEventListener('click', function (event) {
	console.log("here2");
	var req = new XMLHttpRequest();       
	var dataSend =  {name:null};
	dataSend.name = document.getElementById('volSignInBar').value || null;
	console.log(dataSend.name);
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
                makeVolAppHistTable(JSON.parse(req.responseText), dataSend.name);
                makeVolJobHistTable(JSON.parse(req.responseText));
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

function makeVolAppHistTable(responseObj, volunteer) {
	var appHist = responseObj.volAppHist;
	console.log(volunteer);
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
	var url = '?id=';
	var name = '&name=' + volName;
	console.log(volName);
    var deleteSend = null;
    deleteSend = event.target.parentElement.parentElement.id
   console.log(deleteSend)
    req.open("delete", '/DeleteVolApp' + url + deleteSend + name, true);
  	
    req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
            makeVolAppHistTable(JSON.parse(req.responseText),volName);
		}
		else {
    		console.log("Error in network request: " + req.statusText);
  		}
	});
 
    req.send(null);
    event.preventDefault();

}


function makeVolJobHistTable(responseObj) {
	
	var jobHist = responseObj.volJobHist;
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