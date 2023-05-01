const myEmailField = document.querySelector("#email");
const myCopyButton = document.createElement("img");

//Set copy button info
myCopyButton.src = "https://laurentiuandrei.com/images/copy.png";
myCopyButton.setAttribute("id","copyButtonID");
myCopyButton.addEventListener("click", copyEmailToClipboard);

// Add button to DOM
myEmailField.parentNode.insertBefore(myCopyButton, myEmailField.nextSibling);

// Copy to clipboard function
function copyEmailToClipboard() {
	navigator.clipboard.writeText(myEmailField.value);
}

// An array with elements to be removed
const elementsToRemove = [
	"body > div > div.top_line",
	"#navbar-container > div",
	"#navbar-content-title",
	"#basicPage > h2 > span:nth-child(2)"
];

// Removes elements from an array
function enf_RemoveElements() {
	for(i = 0; i < elementsToRemove.length; i++) {
		document.querySelector(elementsToRemove[i]).remove();
	}
}

// Remove Inline style
document.querySelector("#mainview").removeAttribute("style");
document.querySelector("#basicPage > h2 > span").removeAttribute("style");
document.querySelector("#basicNote").removeAttribute("style");

// Select and remove the notification section
function removeNotificationSection() {
	const notificationSection = document.querySelector("#saveForm > section:nth-child(10)");
	// Check if it has 6 children and remove it only if it has 6
	if (notificationSection.children.length == 6) {
		notificationSection.remove();
	}
}

// Function to remove the parent of a node based on the header text
function removeParent(header, el) {
	const element = document.querySelector(el);
	
	if(element.textContent == header) {
		element.parentNode.remove();
	}
}

// Calling functions
enf_RemoveElements();
removeNotificationSection();
removeParent("Social Icon", "#saveForm > section:nth-child(9) > h3");
removeParent("URIs", "#saveForm > section:nth-child(6) > h3");