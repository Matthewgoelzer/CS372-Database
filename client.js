
function loadSearchPage() {
	console.log("here1");
	var req = new XMLHttpRequest();       
	var req = new XMLHttpRequest();       
	
	req.open("GET", "/SearchLoaded", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log(JSON.parse(req.responseText));
			makeSearchTable(JSON.parse(req.responseText));
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	req.send();
	event.preventDefault();
};

document.getElementById("searchButton").addEventListener('click', function (event) {
	console.log("here2");
	var req = new XMLHttpRequest();       
	var dataSend =  {search:null};
	dataSend.search = document.getElementById('searchBar').value || null;
	
	if(dataSend.search=== null) {
		alert("Search cannot be null");
		event.preventDefault();
		return;
	}
	req.open("POST", "/Search", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			console.log(req.responseText);
			makeSearchTable(JSON.parse(req.responseText));
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	console.log(dataSend);
	req.send(JSON.stringify(dataSend));
	event.preventDefault();
})  



// function printTable() {
	
// 	var req = new XMLHttpRequest();
//     req.open("GET", '/', true);
//     req.send(null);
//     makeTable(result);
//     event.preventDefault();
// }

function makeSearchTable(responseObj) {
	//delete old table
	document.getElementById("mainTable").removeChild(document.getElementById("bodyTable"));
	//amke new table 
	var bodyT = document.createElement('tbody');
	bodyT.id = "bodyTable";
	document.getElementById("mainTable").appendChild(bodyT);
	//make a row for each row in returned Json data
	responseObj.forEach(function(row) {
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

		//make apply button
		var applyCell = document.createElement("td")
		applyCell.id = "apply"+ row["job_ID"]
		var applyBtn = document.createElement('button');
		applyBtn.id = "applyBtn"+ row["job_ID"];
		applyBtn.className = "btn btn-primary";
		applyCell.appendChild(applyBtn);
		newRow.appendChild(applyCell);
		applyBtn.textContent = "Apply";
		
		//add row
		bodyTable.appendChild(newRow);
		document.getElementById("applyBtn" + row["job_ID"]).addEventListener("click", makeApplyForm);
		// document.getElementById("deleteBtn" + row["id"]).addEventListener("click", deleteRow);

	})
};

function deleteRow(event) {
	var req = new XMLHttpRequest();
	var url = '?id=';
    
    var deleteSend = null;
    deleteSend = event.target.parentElement.parentElement.id
   
    req.open("delete", '/' + url + deleteSend, true);
  	
    req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
  			makeTable(JSON.parse(req.responseText));
		}
		else {
    		console.log("Error in network request: " + req.statusText);
  		}
	});
 
    req.send(null);
    event.preventDefault();

}

/*
	Function: makeEditForm()
	Description: Makes edit form above table to edit row. Information is pre-filled with existing row data. 
	Arguments: Event of edit button from row. 
	Returns: None.
*/
function makeApplyForm(event) {
	//get row id
	var rowID = event.target.parentElement.parentElement.id;
	console.log(rowID);
	//make edit form 
	var applyField = document.createElement("fieldset");
	applyField.id = "applyField";
	document.getElementById("forms").appendChild(applyField);
	var applyLegend = document.createElement("legend")
	applyLegend.id = "applyLegend";
	applyLegend.textContent = "Apply";
	document.getElementById("applyField").appendChild(applyLegend);
	var applyForm = document.createElement("form");
	applyForm.id = "applyF";
	document.getElementById("applyField").appendChild(applyForm);
	
	var nameLabel =document.createElement('label');
	nameLabel.textContent = "Name: ";
	document.getElementById("applyF").appendChild(nameLabel)
	var applyName1 = document.createElement('input');
	applyName1.type = "text";
	applyName1.id = "applyName";
	// applyName1.value = document.getElementById("name"+ rowID).textContent; 
	document.getElementById("applyF").appendChild(applyName1);

	var applySubBtn = document.createElement("button");
	applySubBtn.textContent = "Submit";
	applySubBtn.id = "applySB";
	applySubBtn.className = "btn btn-primary";
	applySubBtn.name = rowID;
	document.getElementById("applyF").appendChild(applySubBtn);
	document.getElementById("applySB").addEventListener("click", applyRow);
	

}

/*
	Function: editRow()
	Description: Gets information from edit form and sends to the server. Then deletes edit form. 
	Arguments: Edit form is made. 
	Returns: None.
*/
function applyRow() {
	var req = new XMLHttpRequest();
	var dataSend =  {job_ID:null, volunteer_Name:null};
	dataSend.job_ID = document.getElementById("applySB").name;
	dataSend.volunteer_Name = document.getElementById("applyName").value || null;
	
	if(dataSend.volunteer_Name === null) {
		alert("Name cannot be null");
		event.preventDefault();
		return;
	}
	dataSend2 = JSON.stringify(dataSend)
	console.log(dataSend2);
	req.open("POST", "/jobApply", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			// makeTable(JSON.parse(req.responseText));
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
		  
	req.send(dataSend2);
	document.getElementById("applyField").remove()
	event.preventDefault();
}
