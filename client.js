
document.addEventListener('DOMContentLoaded', searchButton);

// function searchButton() {
    document.getElementById("searchButton").addEventListener('click', function (event) {
		console.log("here1")
		var req = new XMLHttpRequest();       
        var dataSend =  {search:null};
        dataSend.search = document.getElementById('searchBar').value || null;
        
        if(dataSend.name === null) {
        	alert("Name cannot be null");
        	event.preventDefault();
        	return;
        }
        req.open("GET", "/jobsAndSearch.html", true);
  		req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
    		if(req.status >= 200 && req.status < 400){
      			makeTable(JSON.parse(req.responseText));
    		}
    		else {
        		console.log("Error in network request: " + req.statusText);
      		}
  		});
 
        req.send(JSON.stringify(dataSend));
        event.preventDefault();
    })  
// }


function printTable() {
	
	var req = new XMLHttpRequest();
    req.open("GET", '/', true);
    req.send(null);
    makeTable(result);
    event.preventDefault();
}

function makeTable(responseObj) {
	//delete old table
	document.getElementById("mainTable").removeChild(document.getElementById("bodyTable"));
	//amke new table 
	var bodyT = document.createElement('tbody');
	bodyT.id = "bodyTable";
	document.getElementById("mainTable").appendChild(bodyT);
	//make a row for each row in returned Json data
	responseObj.forEach(function(row) {
		var newRow = document.createElement("tr");
		newRow.id = row["id"];

		var name1 = document.createElement("td");
		name1.id = "name"+ row["id"]
		name1.textContent = row["name"];
		newRow.appendChild(name1);

		var rep1 = document.createElement("td");
		rep1.id = "rep"+ row["id"]
		rep1.textContent = row["reps"];
		newRow.appendChild(rep1);

		var weight1 = document.createElement("td");
		weight1.id = "weight"+ row["id"];
		weight1.textContent = row["weight"];
		newRow.appendChild(weight1);

		var date1 = document.createElement("td");
		date1.id = "date"+ row["id"]
		date1.textContent = row["date"];
		newRow.appendChild(date1);

		var lbs1 = document.createElement("td");
		lbs1.id = "lbs"+ row["id"];
		if(row["lbs"] == 1) {
			lbs1.textContent = "lbs";
		}
		else {
			lbs1.textContent = "kg";
		}
		newRow.appendChild(lbs1);
		
		//make delete button
		var deleteCell = document.createElement("td")
		deleteCell.id = "delete"+ row["id"]
		var deleteBtn = document.createElement('button');
		deleteBtn.id = "deleteBtn"+ row["id"];
		deleteCell.appendChild(deleteBtn);
		newRow.appendChild(deleteCell);
		deleteBtn.textContent = "Delete"

		//make edit button
		var editCell = document.createElement("td")
		editCell.id = "edit"+ row["id"]
		var editBtn = document.createElement('button');
		editBtn.id = "editBtn"+ row["id"];
		editCell.appendChild(editBtn);
		newRow.appendChild(editCell);
		editBtn.textContent = "Edit";
		
		//add row
		bodyTable.appendChild(newRow);
		document.getElementById("editBtn" + row["id"]).addEventListener("click", makeEditForm);
		document.getElementById("deleteBtn" + row["id"]).addEventListener("click", deleteRow);

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
function makeEditForm(event) {
	//get row id
	var rowID = event.target.parentElement.parentElement.id;

	//make edit form 
	var editField = document.createElement("fieldset");
	editField.id = "editField";
	document.getElementById("forms").appendChild(editField);
	var editLegend = document.createElement("legend")
	editLegend.id = "editLegend";
	editLegend.textContent = "Edit Exercise";
	document.getElementById("editField").appendChild(editLegend);
	var editForm = document.createElement("form");
	editForm.id = "editF";
	document.getElementById("editField").appendChild(editForm);
	
	var nameLabel =document.createElement('label');
	nameLabel.textContent = "Machine Name: ";
	document.getElementById("editF").appendChild(nameLabel)
	var editName1 = document.createElement('input');
	editName1.type = "text";
	editName1.id = "editName";
	editName1.value = document.getElementById("name"+rowID).textContent; 
	document.getElementById("editF").appendChild(editName1);

	var repLabel =document.createElement('label');
	repLabel.textContent = "Number of Reps:";
	document.getElementById("editF").appendChild(repLabel)
	var editReps = document.createElement('input');
	editName.type = "text";
	editReps.id = "editRep";
	editReps.value = document.getElementById("rep" + rowID).textContent;
	document.getElementById("editF").appendChild(editReps);

	var weightLabel =document.createElement('label');
	weightLabel.textContent = " Weight:";
	document.getElementById("editF").appendChild(weightLabel)
	var editWeight1 = document.createElement('input');
	editWeight1.type = "text";
	editWeight1.id = "editWeight";
	editWeight1.value = document.getElementById("weight" + rowID).textContent;
	document.getElementById("editF").appendChild(editWeight1);

	var dateLabel =document.createElement('label');
	dateLabel.textContent = " Date:";
	document.getElementById("editF").appendChild(dateLabel)
	var editDate = document.createElement('input');
	editDate.type = "date";
	editDate.id = "editDate";
	editDate.value = document.getElementById("date" + rowID).textContent;
	document.getElementById("editF").appendChild(editDate);

	var lbsLabel =document.createElement('label');
	lbsLabel.textContent = "Units in lbs";
	document.getElementById("editF").appendChild(lbsLabel)
	var editLbs = document.createElement('input');
	editLbs.type = "checkbox";
	editLbs.id = "editLbs";
	if(document.getElementById("lbs" + rowID).textContent === "lbs") {
		editLbs.checked = 1;
	}
	else {
		editLbs.checked = 0;
	}
	document.getElementById("editF").appendChild(editLbs);

	var editSubBtn = document.createElement("button");
	editSubBtn.textContent = "Submit";
	editSubBtn.id = "editSB";
	editSubBtn.name = rowID;
	document.getElementById("editF").appendChild(editSubBtn);
	document.getElementById("editSB").addEventListener("click", editRow);
	

}

/*
	Function: editRow()
	Description: Gets information from edit form and sends to the server. Then deletes edit form. 
	Arguments: Edit form is made. 
	Returns: None.
*/
function editRow() {
	var req = new XMLHttpRequest();
	var eId = '?id=' + document.getElementById("editSB").name;
	var eName = '&name=' + document.getElementById("editName").value || null;
	var eRep = '&reps=' + document.getElementById("editRep").value || null;
	var eWeight = '&weight=' + document.getElementById("editWeight").value || null;
	var eDate = '&date=' + document.getElementById("editDate").value || null;
	var eLbs = null;
	 if(document.getElementById("editLbs").checked) {
	 	var eLbs = '&lbs=' + 1;
	  }
	  else {
	  	eLbs = '&lbs=' + 0;
	  }
  
    req.open("put", '/' + eId + eName + eRep + eWeight + eDate + eLbs, true);
  	
    req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
  			makeTable(JSON.parse(req.responseText));
		}
		else {
    		console.log("Error in network request: " + req.statusText);
  		}
	});
 
    req.send(null);
    document.getElementById("editField").remove()
    event.preventDefault();
}
