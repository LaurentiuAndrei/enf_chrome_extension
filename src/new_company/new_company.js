const NOTE_SECTION = document.querySelector("#basicNote");
const SAVE_FORM = document.querySelector("#saveForm");
const POST_CODE = document.querySelector("#postcode");
const PHONE_NUM = document.querySelector("#phone");
const HEADERS = document.querySelectorAll("h3");
const PAGE_TITLE = document.querySelector("h2.page_title");
let COUNTRY;
let isFirstAddress = true;

// Remove "Clear coordinate" before adding copy buttons
removeClearCoordinate();

// Adding the copy to clipboard buttons and their tooltips
addCopyToClipboardButtons();

// Rearrange the service/view/save buttons in the header
handleHeaderButtons();

// Check for clicks on google search icon and copy button
SAVE_FORM.addEventListener("click", function (e) {
	let elementID = e.target.getAttribute("id");

	if (elementID == "copyButtonID") {
        let input = document.querySelector('#' + e.target.getAttribute("copy-from"));

		navigator.clipboard.writeText(input.value);
		e.target.firstElementChild.innerHTML = "Copied";
	}
    else if (elementID == "googleSearch") {
        const website = document.querySelector("#website");
        const companyName = document.querySelector(`#${e.target.getAttribute('for')}`);
        const label = e.target.parentNode.querySelector("label");

		const searchInfo = [
            website.value,
            companyName.value,
            label.textContent
        ];

        //Send the search data to the service worker so it can open a new tab
		chrome.runtime.sendMessage({ type: "strings", data: searchInfo });
	}
});

// Restore the contents of tooltip after exitig the copy button area
SAVE_FORM.addEventListener("mouseout", function (e) {
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

// Notes Section
// Move the notes as the last child of the main form
SAVE_FORM.append(NOTE_SECTION);

// Remove fields based on label names
removeCompanyFields();

// remove the info boxes with ? near some inputs
removeInfoBoxes ();

// Move Address to the bottom of contact
document
	.querySelector("#email")
	.parentNode.parentNode.append(document.querySelector("#address").parentNode);

// Remove enquiry email to special
document.querySelector("#address").parentNode.previousElementSibling.remove();

// Remove sections based on h3 names
removeSections();

// Add textarea of address without removing the original one
let ADDRESS = document.querySelector("#address");
let NEW_ADDRESS = document.createElement("textarea");

NEW_ADDRESS.setAttribute("id", "newAddress");
NEW_ADDRESS.textContent = ADDRESS.value;

ADDRESS.after(NEW_ADDRESS);
ADDRESS.style.display = "none";

insertPostCodeStatusLabel();

NEW_ADDRESS.addEventListener("blur", function (e) {
	ADDRESS.value = NEW_ADDRESS.value;
	findPostCodeFromAddress();
});

// Move the postcode under the address
NEW_ADDRESS.parentNode.insertAdjacentElement("afterend", postcode.parentNode);

function removeClearCoordinate() {
    const clearCoordinate = document.querySelector("#address").nextElementSibling;
    if (clearCoordinate.nodeName == "A") {
        clearCoordinate.remove();
    }
}

function removeCompanyFields() {
	const companyFieldsToRemove = [
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

    for(label of companyLabels) {
		if (companyFieldsToRemove.includes(label.textContent)) {
			label.parentNode.remove();
		}
	}
}

function removeNotificationSection() {
	const notificationSection = SAVE_FORM.lastElementChild;
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
}

function removeUnusedFields() {
	const elementsToRemove = [
		"body > div > div.top_line",
		"#navbar-container > div",
		"#navbar-content-title",
		"#basicPage > h2 > span:nth-child(2)"
	];

    for(element of elementsToRemove) {
        try {
            document.querySelector(element).remove();
        } catch (error) {
            console.error(`An error occured:${error}`);
        }
	}
}

function addCopyToClipboardButtons() {
	const companyInputs = SAVE_FORM.querySelectorAll("input.input-text");
	const copyButton = document.createElement("div");
	const toolTip = document.createElement("div");

	copyButton.setAttribute("id", "copyButtonID");

	toolTip.classList.add("tooltiptext");
	toolTip.innerHTML = "Copy to clipboard";

	copyButton.appendChild(toolTip.cloneNode(true));

	for (inputField of companyInputs) {
		// Add a copy button for every input text field
        copyButton.setAttribute("copy-from", inputField.getAttribute("id"));
		inputField.insertAdjacentElement("afterend", copyButton.cloneNode(true));
	}
}

addHelpButtons();

function addHelpButtons() {
    const helpButton = document.createElement("div");
    const toolTip = document.createElement("div");

    toolTip.classList.add("tooltiptext");
    toolTip.innerHTML = "[COUNTRY]<br>Format: [FORMAT]";

    helpButton.classList.add("helpButton");
    helpButton.setAttribute("help-for", POST_CODE.getAttribute("id"));
    helpButton.appendChild(toolTip);

    POST_CODE.parentNode.insertBefore(helpButton, POST_CODE.parentNode.firstElementChild);
}

function updateHelpButtons() {
    let countryPostCode = COUNTRY.post_code;

    if(countryPostCode == 'none') countryPostCode = 'not using post codes';

    // Update post code help icon
    const postHelpTooltip = POST_CODE.parentNode.querySelector(".tooltiptext");
    postHelpTooltip.innerHTML = `<strong>Country:</strong> ${COUNTRY.country}<br><strong>Fomat:</strong> ${countryPostCode}`;
}

addGoogleSearchButton();

// Add the google search button
function addGoogleSearchButton() {
	const googleSearch = document.createElement("div");
    const fieldIDs = ['name', 'shortName'];

	googleSearch.setAttribute("id", "googleSearch");

    for(field of fieldIDs) {
        googleSearch.setAttribute('for', field);
        document.querySelector(`#${field}`).insertAdjacentElement("afterend", googleSearch.cloneNode());
    }
}

// Rename labels
renameLabels();

// Create "Other" section
NOTE_SECTION.insertAdjacentHTML(
	"afterend",
	"<section id='others'><h3>Others</h3><span class='mid_sec'><fieldset></fieldset></span></section>"
);

// Add IDs to sections
const sectionIDs = ["Basic", "Contact", "Location"];

for (let i = 0; i < HEADERS.length; i++) {
	if (sectionIDs.includes(HEADERS[i].textContent)) {
		HEADERS[i].parentNode.setAttribute(
			"id",
			HEADERS[i].textContent.toLowerCase()
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
removeQC();

// Add center class to #basicNote
NOTE_SECTION.classList.add("center-element");

function renameLabels() {
    const labelsToRename = {
        "Name": "Legal Name",
        "Parent": "Parent Company"
    };

    const labels = document.querySelectorAll("label");

    labels.forEach(label => {
        const originalLabel = label.textContent.trim();
        const renamedLabel = Object.keys(labelsToRename).find(
            label => label === originalLabel
        );
        if (renamedLabel) {
            label.textContent = labelsToRename[renamedLabel];
        }
    });
}

function removeQC() {
    const conRight = document.querySelector("#contact > span.con_right");
    const statusElements = conRight.childNodes;

    let sendEmailContainer = document.createElement("div");
    conRight.parentNode.appendChild(sendEmailContainer);
    sendEmailContainer.setAttribute("id", "sendEmailContainer");

    for(let i = 0; i < statusElements.length; i++) {
        if(statusElements[i].nodeName === "INPUT" && statusElements[i].getAttribute("name") === "sendemail") {
            sendEmailContainer.appendChild(statusElements[i]);
            sendEmailContainer.appendChild(statusElements[i++]);
        }
        else if(statusElements[i].nodeName === "BR") {
            statusElements[i].remove();
        }
    }

    // Find the element with type="hidden" then remove element from next position until the array shortens to the position of the next element
    for (let i = 0; i < statusElements.length; i++) {
        if (statusElements[i].type == "hidden") {
            for (i++; i < statusElements.length;) {
                statusElements[i].remove();
            }

            break;
        }
    }
}

function findPostCodeFromAddress() {
    if(COUNTRY.post_code == 'none') {
        styleInputText(POST_CODE, "none");
        return;
    }

    const address = NEW_ADDRESS.value;
    const pattern = new RegExp(COUNTRY.post_code_pattern, 'g');

    let matches = address.match(pattern);

    if(!matches) {
        styleInputText(POST_CODE, "missing");
        return;
    }

    if(isFirstAddress) {
        let post_code = POST_CODE.value;
        isFirstAddress = false;

        if(!matches.includes(post_code)) return;
    }

    // Update the post_code with the last matched pattern
    POST_CODE.value = matches[matches.length - 1];

	if (matches.length == 1) styleInputText(POST_CODE, "success");
	else styleInputText(POST_CODE, "conflict");
}

function styleInputText(element, status) {
	let borderStyle, backgroundStyle, borderColor;
    let message = "";

	switch (status) {
		case "conflict":
            borderColor = '#ff8600';
			borderStyle = `1px solid ${borderColor}`;
			backgroundStyle = "#ffe9da";
            message = "More than 1 post code has been detected."
			break;
		case "success":
			borderColor = '#008805';
			borderStyle = `1px solid ${borderColor}`;
			backgroundStyle = "#e2ffda";
            message = "Post code has been detected."
			break;
		case "missing":
			borderColor = '#b70000';
			borderStyle = `1px solid ${borderColor}`;
			backgroundStyle = "#ffdada";
            message = "No post code detected."
			break;
        case "none":
            borderColor = '#0081c9';
            element.removeAttribute("style");
            message = "Country does not use post codes."
            break;    
	}
    element.style.setProperty("border", borderStyle, "important");
    element.style.setProperty("background", backgroundStyle, "important");

    updatePostCodeStatus(message, borderColor);
}

function updatePostCodeStatus(message, color) {
    let postCodeStatus = document.querySelector("#postCodeStatus");

    postCodeStatus.innerHTML = message;
    postCodeStatus.style.setProperty("background-color", color, "important");
}

function insertPostCodeStatusLabel() {
    const postCodeStatus = document.createElement("span");

    postCodeStatus.setAttribute("id", "postCodeStatus");
    POST_CODE.parentNode.appendChild(postCodeStatus);
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
let COUNTRY_DATA;

// Fetch the country data file
async function fetchData() {
	try {
		const response = await fetch(
			chrome.runtime.getURL("data/country_info.json")
		);
		const data = await response.json();
		COUNTRY_DATA = data;
		console.log("Country data has been loaded into the array");

        updateFields();
	} 
    catch (error) {
		console.error(error);
	}
}

fetchData();

function updateFields() {
    getCountryInfo();
    formatPhoneNumber();
    updateHelpButtons();
    findPostCodeFromAddress();
}

// Format the phone number every time we click out of the phone num field
PHONE_NUM.addEventListener("blur", function () {
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
	let phone = PHONE_NUM.value;

	// if phone field is empty, don't go any further
	if (!phone) return;

    const countryCode = COUNTRY.phone_code;

	// remove all non numerical characters
	phone = phone.replace(/\D/g, "");

    // Remove phone code if found
    let strippedCountryCode = countryCode.replace(/\D/g, "");
	if (phone.startsWith(strippedCountryCode)) {
		phone = phone.replace(new RegExp(strippedCountryCode), "");
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
	PHONE_NUM.value = phone;
}

function isBetween(number, lowerBound, upperBound) {
	return number >= lowerBound && number <= upperBound;
}

// removes the ? "tooltip" default boxes
function removeInfoBoxes () {
    const boxes = document.querySelectorAll(".infom");
    for(box of boxes) box.remove();
}

function getCountryInfo() {
    let selectedCountry = document.querySelector("#country_chosen > a > span");

	COUNTRY = COUNTRY_DATA.find(function (obj) {
		return obj.country === selectedCountry.textContent;
	});
}

const COUNTRY_SELECTOR = document.querySelector(".chosen-container");

COUNTRY_SELECTOR.addEventListener("click", function(e) {
    if(e.target.classList.contains("active-result")) {
        getCountryInfo();
        updateHelpButtons();
        findPostCodeFromAddress();
    }
});

function removeSections() {
    const headersToRemove = ["URIs", "Social Icon", "Location"];
    
    for(header of HEADERS) {
        if (headersToRemove.includes(header.textContent)) {
            header.parentNode.remove();
        }
    }
}

function handleHeaderButtons() {
    const viewBtn = PAGE_TITLE.querySelector(".bmenu");
    const saveBtn = PAGE_TITLE.querySelector("button.green_btn");

    const links = PAGE_TITLE.querySelectorAll("a");
    // Find the "Service" button based on the href of the anchor elements
    for(elem of links) {
        let link = elem.getAttribute("href");
        
        if(link.includes("service")) {
            elem.setAttribute("id","serviceBtn");
            PAGE_TITLE.appendChild(elem);
        }
    }

    if(viewBtn) {
        PAGE_TITLE.appendChild(viewBtn);
    }
    
    PAGE_TITLE.appendChild(saveBtn);
}

splitSections();

function splitSections() {
    const sectionContainer = document.createElement("div");
    const basic = SAVE_FORM.querySelector("#basic");
    const contact = SAVE_FORM.querySelector("#contact");

    sectionContainer.setAttribute("id", "sectionContainer");

    SAVE_FORM.insertAdjacentElement('afterbegin', sectionContainer);
    sectionContainer.insertAdjacentElement('afterbegin', contact);
    sectionContainer.insertAdjacentElement('afterbegin', basic);
}