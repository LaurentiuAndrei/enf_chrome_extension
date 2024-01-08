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

    // add the new paste functionality
    add_new_paste();
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

function add_new_paste() {
    let parentTable = document.querySelector('table');
    var inputs = Array.from(parentTable.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])'));
    
    // Find the max amount of columns
    var maxColumns = get_max_cols();
    
    // Add a class to all of these elements to make them stand out
    inputs.forEach(function(input) {
        input.classList.add('paste_ready_input');
    });
    
    parentTable.addEventListener('paste', function (e) {
        // if(e.target.matches('input[ng-class="modelInputClass"]')) {
        if(inputs.includes(e.target)) {
            // find the index of the current input
            var startIndex = inputs.indexOf(e.target);

            // prevent default paste action
            e.preventDefault();

            // get pasted data
            var clipboardData = e.clipboardData || window.clipboardData;
            var pastedText = clipboardData.getData('text');

            // replace all a-Z characters with ""
            pastedText = pastedText.replace(/[^0-9. ]/g, "");
            
            // trim and split by space
            var splitText = pastedText.trim().split(/\s+/);

            if(splitText.length > maxColumns) {
                alert(`You are trying to paste ${splitText.length} values, but you only have ${maxColumns} columns`);
                return;
            }

            // Calculate the row number of the selected field given the max number of cols in that row
            rowNumber = 1
            while(startIndex >= maxColumns * rowNumber) {
                rowNumber++;
            }
            
            // Pick the smallest number
            maxIndex = Math.min(rowNumber * maxColumns, startIndex + splitText.length)

            // Replace the following maxColumn input field values
            for (var i = startIndex; i < maxIndex; i++) {
                if (i < inputs.length) {
                    inputs[i].value = splitText[i - startIndex];
                }
            }
        }
    });

    function get_max_cols() {
        let cols = 0;

        for (var i = 0; i < parentTable.rows.length; i++) {
            // Get the current row
            var row = parentTable.rows[i];

            // If this row has more columns than the current maximum, update the maximum
            if (row.cells.length > cols) {
                cols = row.cells.length - 1;
            }
        }
        return cols;
    }
}