const noteSection = document.querySelector("#basicNote");
const saveForm = document.querySelector("#saveForm");
const postCode = document.querySelector("#postcode");
const phoneNumber = document.querySelector("#phone");

// Remove "Clear coordinate" before adding copy buttons
const clearCoordinate = document.querySelector("#address").nextElementSibling;
if (clearCoordinate.nodeName == "A") {
	clearCoordinate.remove();
}

// Adding the copy to clipboard buttons and their tooltips
addCopyToClipboardButtons();

// Add click events only to the copy buttons
saveForm.addEventListener("click", function (e) {
	let elementID = e.target.getAttribute("id");

	if (elementID == "copyButtonID") {
        let input = document.querySelector('#' + e.target.getAttribute("copy-from"));

		navigator.clipboard.writeText(input.value);
		e.target.firstElementChild.innerHTML = "Copied";
	}
    else if (elementID == "googleSearch") {
        const companyName = e.target.previousElementSibling.value;
        const website = document.querySelector("#website").value;
		const searchInfo = [website, companyName];

		chrome.runtime.sendMessage({ type: "strings", data: searchInfo });
	}
});

// Restore the contents of tooltip after exitig the copy button area
saveForm.addEventListener("mouseout", function (e) {
	if (e.target.getAttribute("id") == "copyButtonID") {
		e.target.firstElementChild.innerHTML = "Copy to clipboard";
	}
});

// An array with elements to be removed
removeUnusedFields();

// Temporarely remove Inline style
tempRemoveInlineStyles();

// Select and remove the notification section. Needs to happen before moving the notes
removeNotificationSection();

// Ad Plan
const adPlan = document.querySelector("#basicNote > div");
adPlan.classList.add("ad-plan");
document.querySelector("div.displaytable").before(adPlan);

// Notes Section
// Move the notes as the last child of the main form
saveForm.append(noteSection);

// Remove fields based on label names
removeCompanyFields();

// Move Address to the bottom of contact
document
	.querySelector("#email")
	.parentNode.parentNode.append(document.querySelector("#address").parentNode);

// Remove adjust location button
const adjustLocation = document.querySelector("#adjust_location");
if (adjustLocation) {
	adjustLocation.remove();
}

// Remove enquiry email to special
document.querySelector("#address").parentNode.previousElementSibling.remove();

// Remove sections based on h3 names
const headers = document.querySelectorAll("h3");
const headersToRemove = ["URIs", "Social Icon", "Location"];

for (let i = 0; i < headers.length; i++) {
	if (headersToRemove.includes(headers[i].textContent)) {
		headers[i].parentNode.remove();
	}
}

// Add textarea of address without removing the original one
var address = document.querySelector("#address");
var newAddress = document.createElement("textarea");

newAddress.setAttribute("id", "newAddress");
newAddress.textContent = address.value;

address.after(newAddress);
address.style.display = "none";

newAddress.addEventListener("blur", function (e) {
	address.value = newAddress.value;
	findPostCodeFromAddress(newAddress.value);

    // if(!postCode.value) {
    //     styleInputText(postCode, "normal");
    // }
});

// Move the postcode under the address
newAddress.parentNode.insertAdjacentElement("afterend", postcode.parentNode);

// Check if the post code can be found in the address
findPostCodeFromAddress(newAddress.value);

function removeCompanyFields() {
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
		"Area3",
	];

	const companyLabels = document.querySelectorAll("label");

	for (let i = 0; i < companyLabels.length; i++) {
		if (companyFieldsToRemove.includes(companyLabels[i].textContent)) {
			companyLabels[i].parentNode.remove();
		}
	}
}

function removeNotificationSection() {
	const notificationSection = saveForm.lastElementChild;
	if (notificationSection) {
		notificationSection.remove();
	}
}

function tempRemoveInlineStyles() {
	document.querySelector("#address").parentNode.removeAttribute("style");

	const elementsToRemoveStyleFrom = [
		"#mainview",
		"#basicPage > h2 > span",
		"#basicNote",
		"#basicNote > div",
	];

	for (let i = 0; i < elementsToRemoveStyleFrom.length; i++) {
		let target = document.querySelector(elementsToRemoveStyleFrom[i]);

		if (target) {
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
}

function removeUnusedFields() {
	const elementsToRemove = [
		"body > div > div.top_line",
		"#navbar-container > div",
		"#navbar-content-title",
		"#basicPage > h2 > span:nth-child(2)",
		"#basicNote > a",
	];

	for (let i = 0; i < elementsToRemove.length; i++) {
		if (elementsToRemove[i]) {
			document.querySelector(elementsToRemove[i]).remove();
		}
	}
}

function addCopyToClipboardButtons() {
	const companyInputs = saveForm.querySelectorAll("input.input-text");
	const imageURL = chrome.runtime.getURL("resources/images/copy-icon.png");
	const copyButton = document.createElement("div");
	const toolTip = document.createElement("span");

	copyButton.style.backgroundImage = `url(${imageURL})`;
	copyButton.setAttribute("id", "copyButtonID");

	toolTip.classList.add("tooltiptext");
	toolTip.setAttribute("id", "myTooltip");
	toolTip.innerHTML = "Copy to clipboard";

	copyButton.appendChild(toolTip.cloneNode(true));

	for (inputField of companyInputs) {
		// Add a copy button for every input text field
        copyButton.setAttribute("copy-from", inputField.getAttribute("id"));
		inputField.insertAdjacentElement("afterend", copyButton.cloneNode(true));
	}
}

addGoogleSearchButton();

function addGoogleSearchButton() {
	const googleSearch = document.createElement("img");

	googleSearch.setAttribute("id", "googleSearch");
	googleSearch.setAttribute(
		"src",
		chrome.runtime.getURL("resources/images/google-search-icon.png")
	);

	document.querySelector("#name").insertAdjacentElement("afterend", googleSearch);
	document.querySelector("#shortName").insertAdjacentElement("afterend", googleSearch.cloneNode());
}

// Rename name label to legal name
const legalName = document.querySelector("#name");

if (legalName.previousElementSibling.textContent == "Name") {
	legalName.previousElementSibling.textContent = "Legal Name";
}

// Create "Other" section
noteSection.insertAdjacentHTML(
	"afterend",
	"<section id='others'><h3>Others</h3><span class='mid_sec'><fieldset></fieldset></span></section>"
);

// Add IDs to sections
const sectionIDs = ["Basic", "Contact", "Location"];

for (let i = 0; i < headers.length; i++) {
	if (sectionIDs.includes(headers[i].textContent)) {
		headers[i].parentNode.setAttribute(
			"id",
			headers[i].textContent.toLowerCase()
		);
	}
}

// Move fields to the other section
const basicFields = document.querySelectorAll(
	"#basic span.mid_sec > fieldset > div"
);
const staffField = document.querySelector("#staff");

for (let i = 0; i < basicFields.length; i++) {
	if (basicFields[i] == staffField.parentNode) {
		for (i++; i < basicFields.length; i++) {
			document
				.querySelector("#others > span.mid_sec > fieldset")
				.append(basicFields[i]);
		}
		break;
	}
}

// Move the Logo section to the top of Basic
const logoSection = document.querySelector("#basic > span.con_right");

document.querySelector("#basic > span.mid_sec").before(logoSection);

// Remove the QC area
const statusElements = document.querySelector(
	"#contact > span.con_right"
).childNodes;

for (let i = 0; i < statusElements.length; i++) {
	if (
		statusElements[i].nodeName == "#text" ||
		statusElements[i].nodeName == "BR"
	) {
		statusElements[i].remove();
	}
}

// Find the element with type="hidden" then remove element from next position until the array shortens to the position of the next element
for (let i = 0; i < statusElements.length; i++) {
	if (statusElements[i].type == "hidden") {
		for (i++; i < statusElements.length; ) {
			statusElements[i].remove();
		}

		break;
	}
}

// Add center class to #basicNote
noteSection.classList.add("center-element");

// Finds the post code based on the address
function findPostCodeFromAddress(str) {
	const addressElements = str.split(",");
	let countOfOnlyDigits = 0;

	// Loop through the address to find the post code
	for (let i = 0; i < addressElements.length; i++) {
		let trimmed = addressElements[i].trim();

		// Post code is valid if it contains only 4 digits or more
		if (matchesPattern(trimmed) && trimmed.length >= 4) {
			postCode.value = trimmed;
			countOfOnlyDigits++;
		}
	}

	if (countOfOnlyDigits == 0) styleInputText(postCode, "missing");
	else if (countOfOnlyDigits == 1) styleInputText(postCode, "success");
	
    // if(!postCode.value) styleInputText(postCode, "normal");
	else styleInputText(postCode, "conflict");
}

function styleInputText(element, status) {
	let borderStyle, backgroundStyle;
	switch (status) {
		case "conflict":
			borderStyle = "1px solid #ff8600";
			backgroundStyle = "#ffe9da";
			break;
		case "success":
			borderStyle = "1px solid #008805";
			backgroundStyle = "#e2ffda";
			break;
		case "missing":
			borderStyle = "1px solid #b70000";
			backgroundStyle = "#ffdada";
			break;
		case "normal":
			borderStyle = "1px solid rgba(33, 35, 44, 0.24)";
			backgroundStyle = "#fff";
			break;
	}
    element.style.setProperty("border", borderStyle, "important");
    element.style.setProperty("background", backgroundStyle, "important");
}

// Checks if a string contains only digits
function containsOnlyDigits(str) {
	for (let i = 0; i < str.length; i++) {
		if (isNaN(parseInt(str[i]))) {
			return false; // If a non-digit character is found, return false
		}
	}
	return true; // If all characters are digits, return true
}

/* Explanation
^ asserts the start of the string.
[] denotes a character class, which allows any character within it to match.
\d matches any digit character (0-9).
\s matches any whitespace character, including spaces, tabs, and line breaks.
- matches a literal hyphen.
+ specifies that the character class should match one or more times.
$ asserts the end of the string. */

function matchesPattern(str) {
	const pattern = /^[\d\s-]+$/;
	return pattern.test(str);
}

// Phone formatting
var countries;

fetch(chrome.runtime.getURL("resources/countries.json"))
	.then((response) => response.json())
	.then((data) => {
		countries = data;
		formatPhoneNumber();
	});

// Format the phone number every time we click out of the phone num field
phoneNumber.addEventListener("blur", function () {
	formatPhoneNumber();
});

const phoneFormats = [
	{ digits: 12, format: /(\d{4})(\d{4})(\d{4})/g },
	{ digits: 11, format: /(\d{4})(\d{4})(\d{3})/g },
	{ digits: 10, format: /(\d{4})(\d{3})(\d{3})/g },
	{ digits: 9, format: /(\d{3})(\d{3})(\d{3})/g },
	{ digits: 8, format: /(\d{4})(\d{4})/g },
	{ digits: 7, format: /(\d{4})(\d{3})/g },
	{ digits: 6, format: /(\d{3})(\d{3})/g },
];

function formatPhoneNumber() {
	var phone = phoneNumber.value;

	// if phone field is empty, don't go any further
	if (!phone) return;

	const countryName = getCountryName();
	const countryCode = countries[countryName];

	// remove all non numerical characters
	phone = phone.replace(/\D/g, "");

	// remove the country code if found
	if (phone.startsWith(countryCode)) {
		phone = phone.replace(new RegExp(countryCode), "");
	}

	// deconstruct the digits/format based on phone.length
	const { digits, format } =
		phoneFormats.find((phoneA) => phoneA.digits === phone.length) || {};

	// check if the digits/format were found, if not, return
	if (!digits || !format) {
		return;
	}

	// apply the correct format based on the amount of digit pairs
	if (isBetween(digits, 9, 12)) phone = phone.replace(format, "$1 $2 $3");
	else if (isBetween(digits, 6, 8)) phone = phone.replace(format, "$1 $2");

	// Add + before country code and an empty space after, lastly add the formatted phone number
	phone = `+${countryCode} ${phone}`;
	phoneNumber.value = phone;
}

function getCountryName() {
	// Returns country name as a string
	return document.querySelector("a.chosen-single span").textContent;
}

function isBetween(number, lowerBound, upperBound) {
	return number >= lowerBound && number <= upperBound;
}
