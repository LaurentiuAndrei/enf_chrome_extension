const noteSection = document.querySelector("#basicNote");
const saveForm = document.querySelector("#saveForm");

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

function enf_RemoveElements() {
	for(let i = 0; i < elementsToRemove.length; i++) {
		if(elementsToRemove[i]) {
			document.querySelector(elementsToRemove[i]).remove();
		}
	}
}

enf_RemoveElements();

// Remove Inline style
document.querySelector("#mainview").removeAttribute("style");
document.querySelector("#basicPage > h2 > span").removeAttribute("style");
document.querySelector("#basicNote").removeAttribute("style");
document.querySelector("#basicNote > div").removeAttribute("style");
document.querySelector("#address").parentNode.removeAttribute("style");

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
]

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