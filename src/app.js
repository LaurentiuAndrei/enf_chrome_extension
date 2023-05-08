const noteSection = document.querySelector("#basicNote");
const saveForm = document.querySelector("#saveForm");

// Remove "Clear coordinate" before adding copy buttons
document.querySelector("#address").nextElementSibling.remove();

// Add Copy to clipboard buttons
const companyInputs = saveForm.querySelectorAll("input");

for(let i = 0; i < companyInputs.length; i++) {
	if(companyInputs[i].classList.contains('input-text')) {
		let copyButton = document.createElement("img");
		
		copyButton.src = "https://laurentiuandrei.com/images/copy.png";
		copyButton.setAttribute("id","copyButtonID");
		// copyButton.addEventListener("click", function() {
		// 	navigator.clipboard.writeText(companyInputs[i].value);
		// });
		
		companyInputs[i].parentNode.insertBefore(copyButton, companyInputs[i].nextSibling);
	}
}

// Add click events only to the copy buttons
saveForm.addEventListener("click", function(e) {
	if(e.target.getAttribute("id") == "copyButtonID") {
		navigator.clipboard.writeText(e.target.previousElementSibling.value);
	}
});

// An array with elements to be removed
const elementsToRemove = [
	"body > div > div.top_line",
	"#navbar-container > div",
	"#navbar-content-title",
	"#basicPage > h2 > span:nth-child(2)",
	"#basicNote > a"
];


for(let i = 0; i < elementsToRemove.length; i++) {
	if(elementsToRemove[i]) {
		document.querySelector(elementsToRemove[i]).remove();
	}
}

// Temporarely remove Inline style
document.querySelector("#address").parentNode.removeAttribute("style");

const elementsToRemoveStyleFrom = [
	"#mainview",
	"#basicPage > h2 > span",
	"#basicNote",
	"#basicNote > div"
];

for(let i = 0; i < elementsToRemoveStyleFrom.length; i++) {
	let target = document.querySelector(elementsToRemoveStyleFrom[i]);
	
	if(target) {
		target.removeAttribute("style");
	}
}

// Remove inline style for the notes
// const theNotes = noteSection.querySelectorAll("fieldset > ul > li");

// for (let i = 0; i < theNotes.length; i++) {
// 	if(theNotes[i]) {
// 		theNotes[i].removeAttribute("style");
// 	}
// }

// Remove ALL inline styles from the page
// const allElements = document.querySelectorAll("*");

// for (let i = 0; i < allElements.length; i++) {
//     allElements[i].removeAttribute("style");
// }

// Select and remove the notification section. Needs to happen before moving the notes
saveForm.lastElementChild.remove();

// Ad Plan
const adPlan = document.querySelector("#basicNote > div");
adPlan.classList.add("ad-plan");
document.querySelector("div.displaytable").before(adPlan);

// Notes Section
// Move the notes as the last child of the main form
saveForm.append(noteSection);

// Remove fields based on label names
const companyFieldsToRemove = [
	"Enquiry Suspension：",
	"E-mail (Solar System Enquiries)：",
	"E-mail (Panel Enquiries)：",
	"E-mail (Inverter Enquiries)：",
	"E-mail (Mounting System Enquiries)：",
	"E-mail (Cell Enquiries)：",
	"E-mail (EVA Enquiries)：",
	"E-mail (Backsheet Enquiries)：",
	"E-mail (Charge Controller Enquiries)：",
	"E-mail (Storage System Enquiries)：",
	"Regional Address",
	"Area1",
	"Area2",
	"Area3"
];

const companyLabels = document.querySelectorAll("label");

for(let i = 0; i < companyLabels.length; i++) {
	if(companyFieldsToRemove.includes(companyLabels[i].textContent)) {
		companyLabels[i].parentNode.remove();
	}
}

// Move Address to the bottom of contact
document.querySelector("#email").parentNode.parentNode.append(document.querySelector("#address").parentNode);

// Remove adjust location button
document.querySelector("#adjust_location").remove();

// Remove enquiry email to special
document.querySelector("#address").parentNode.previousElementSibling.remove();

// Remove sections based on h3 names
const headers = document.querySelectorAll("h3");
const headersToRemove = [
	"URIs",
	"Social Icon",
	"Location"
];

for(let i = 0; i < headers.length; i++) {
	if(headersToRemove.includes(headers[i].textContent)) {
		headers[i].parentNode.remove();
	}
}

// Add textarea of address without removing the original one
var address = document.querySelector("#address");
var newAddress = document.createElement("textarea");

newAddress.setAttribute("id","newAddress");
newAddress.textContent = address.value;

address.after(newAddress);
address.style.display = "none";

newAddress.addEventListener("blur", function(e) {
	address.value = newAddress.value;
})

// Move the postcode under the address
insertAfter(document.querySelector("#postcode").parentNode, newAddress.parentNode);

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

// Rename name label to legal name
const legalName = document.querySelector("#name");

if(legalName.previousElementSibling.textContent == "Name") {
	legalName.previousElementSibling.textContent = "Legal Name";
}

// Create "Other" section 
noteSection.insertAdjacentHTML("afterend", "<section id='others'><h3>Others</h3><span class='mid_sec'><fieldset></fieldset></span></section>");

// Add IDs to sections
const sectionIDs = [
	"Basic",
	"Contact",
	"Location"
];

for(let i = 0; i < headers.length; i++) {
	if(sectionIDs.includes(headers[i].textContent)) {
		headers[i].parentNode.setAttribute("id", headers[i].textContent.toLowerCase());
	}
}

// Move fields to the other section
const basicFields = document.querySelectorAll("#basic span.mid_sec > fieldset > div");
const staffField = document.querySelector("#staff");

for(let i = 0; i < basicFields.length; i++) {
	if(basicFields[i] == staffField.parentNode) {
		for(i++; i < basicFields.length; i++){
			document.querySelector("#others > span.mid_sec > fieldset").append(basicFields[i]);
		}
		break;
	}
}

// Move the Logo section to the top of Basic
const logoSection = document.querySelector("#basic > span.con_right");

document.querySelector("#basic > span.mid_sec").before(logoSection);


// Remove the QC area
const statusElements = document.querySelector("#contact > span.con_right").childNodes;

for(let i = 0; i < statusElements.length; i++) {
	if(statusElements[i].nodeName == "#text" || statusElements[i].nodeName == "BR") {
		statusElements[i].remove();
	}
}


// Find the element with type="hidden" then remove element from next position until the array shortens to the position of the next element
for(let i = 0; i < statusElements.length; i++) {
	if(statusElements[i].type == "hidden") {
		for(i++; i < statusElements.length;) {
			statusElements[i].remove();
		}
			
		break;
	}	
}