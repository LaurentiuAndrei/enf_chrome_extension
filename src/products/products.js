// Delete empty div from the form
let checkCount = 0;
const maxCheck = 5;
const checkInterval = 1000; // in milliseconds

const intervalId = setInterval(() => {
  const element = document.querySelector("form > div:nth-child(2)");
  
  if (element) {
    element.remove();
    clearInterval(intervalId); // stop checking once the element is found and removed
    create_container();
  } else {
    checkCount++;
    if (checkCount >= maxCheck) {
      clearInterval(intervalId); // stop checking after 5 times
    }
  }
}, checkInterval);

function create_container() {
    // Get the elements
    var navbar = document.querySelector('form > div:nth-child(1)');
    var sidebar = document.querySelector('form > div:nth-child(2)');
    var content = document.querySelector('form > div:nth-child(3)');
    
    // Create a new div
    var newDiv = document.createElement('div');
    newDiv.id = 'main_content';
    
    // Append sidebar and content to the new div
    newDiv.appendChild(navbar);
    newDiv.appendChild(content);
    
    // Insert the new div after the navbar in the form
    sidebar.parentNode.insertBefore(newDiv, sidebar);

    // create the side bar button
    create_sidebar_toggle_button(sidebar, navbar);
}

function create_sidebar_toggle_button(sidebar, navbar) {
    // Create new button element
    var btn = document.createElement("button");
    btn.innerHTML = "⚙️ Hide Sidebar";
    btn.classList.add("btn");
    btn.id = "toggle_sidebar";
    
    // Append the button to the end of the button list
    navbar.firstElementChild.appendChild(btn);
    
    // Add click event listener to the button
    btn.addEventListener("click", function() {
        if (sidebar.style.display === "none") {
            sidebar.style.display = "block";
            btn.innerHTML = "⚙️ Hide Sidebar";
        } else {
            sidebar.style.display = "none";
            btn.innerHTML = "⚙️ Show Sidebar";
        }
    });
}
