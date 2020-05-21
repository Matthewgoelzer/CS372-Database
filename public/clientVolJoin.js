
document.getElementById("addButtonVolProf").addEventListener('click', function (event) {
	console.log("here2");
	      
	let dataSend =  {volunteer_Name:null,volunteer_Email:null,volunteer_DOB:null,location:null};
	dataSend.volunteer_Name = document.getElementById('addVolProfName').value || null;
	dataSend.volunteer_Email = document.getElementById('addVolProfEmail').value || null;
	dataSend.volunteer_DOB = document.getElementById('addVolProfDOB').value || null;
	dataSend.location = document.getElementById('addVolProfLocation').value || null;

	if(dataSend.volunteer_Name=== null) {
		alert("Name cannot be null");
		event.preventDefault();
		return;
	}

	if(dataSend.volunteer_Email=== null) {
		alert("Email cannot be null");
		event.preventDefault();
		return;
	}

	if(dataSend.volunteer_DOB=== null) {
		alert("DOB cannot be null");
		event.preventDefault();
		return;
	}

	if(dataSend.location=== null) {
		alert("Location cannot be null");
		event.preventDefault();
		return;
	}
	let req = new XMLHttpRequest(); 
	req.open("POST", "/NewVolP", true);
	req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load',function(){
		if(req.status >= 200 && req.status < 400){
			// console.log(req.responseText);
			// makeSearchTable(JSON.parse(req.responseText));
		}
		else {
			console.log("Error in network request: " + req.statusText);
		}
	});
	let dataSend2 = JSON.stringify(dataSend);
	console.log(dataSend2);
	req.send(dataSend2);

	document.getElementById('addVolProfName').value = null;
	document.getElementById('addVolProfEmail').value = null;
	document.getElementById('addVolProfDOB').value = null;
	document.getElementById('addVolProfLocation').value = null;

	event.preventDefault();
});
