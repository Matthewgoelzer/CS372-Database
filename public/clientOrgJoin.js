
document.getElementById("addButtonOrgProf").addEventListener('click', function (event) {
	      
	let dataSend =  {organization_Name:null};
	dataSend.organization_Name = document.getElementById('addOrgProfName').value || null;
	console.log(dataSend);
	if(dataSend.organization_Name=== null) {
		alert("Name cannot be null");
		event.preventDefault();
		return;
	}

	let req = new XMLHttpRequest(); 
	req.open("POST", "/NewOrgP", true);
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
	document.getElementById('addOrgProfName').value = null;
	event.preventDefault();
});