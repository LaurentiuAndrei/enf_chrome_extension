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