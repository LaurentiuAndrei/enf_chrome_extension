// Delete empty div from the form
let checkCount = 0;
const maxCheck = 10;
const checkInterval = 500; // in milliseconds

trigger_interval_check();

function trigger_interval_check() {
    const intervalId = setInterval(() => {
        const sidebar = document.querySelector("#enf-ams-fromenf-sidebar");
        
        // Only proceed if the sidebar is new aka loaded with AJAX
        if (sidebar && !sidebar.classList.contains('loaded')) {
            clearInterval(intervalId);

            const element = document.querySelector("form > div:nth-child(2)");
            element.remove();

            add_ul_click_handler();
            create_container();
        }
        else {
            checkCount++;
            if (checkCount >= maxCheck) {
                clearInterval(intervalId); // stop checking after 5 times
                alert('sidebar did not load within 5 seconds, please refresh');
            }
        }
    }, checkInterval);
}

function add_ul_click_handler() {
    console.log('adding ul handler');
    // Select the sidebar ul
    let ulElement = document.querySelector('#enf-ams-fromenf-sidebar > ul');

    // Add event listener to the 'ul' element
    // Fix the page when a new item is selected as it redraws and contents change
    ulElement.addEventListener('click', function(event) {
        console.log('clicked on ul');
        // Check if the clicked element is an 'li'
        if (event.target.tagName.toLowerCase() === 'a') {
            // trigger the interval check again
            console.log('clicked on anchor');
            trigger_interval_check();
        }
    });
}

function create_container() {
    // Get the elements
    var navbar = document.querySelector('form > div:nth-child(1)');
    var sidebar = document.querySelector('form > div:nth-child(2)');
    var content = document.querySelector('form > div:nth-child(3)');

    // Add class 'loaded' so we can differenciate it between processed and new
    sidebar.classList.add('loaded');
    
    // Create a new div
    var newDiv = document.createElement('div');
    newDiv.id = 'main_content';

    // Insert the new div after the navbar in the form
    sidebar.parentNode.insertBefore(newDiv, sidebar);
    
    // Append navbar and content to the new div
    newDiv.appendChild(navbar);
    newDiv.appendChild(content);

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
    checkCount = 0;
    let parentTable;
    let inputs;

    // We need to make sure the table and fields have been filled out before adding the paste functionality
    const paste_intervalId = setInterval(find_table_and_fields, 500);

    function find_table_and_fields() {
        parentTable = document.querySelector('table');
        inputs = Array.from(parentTable.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])'));
        
        if (parentTable && inputs.length > 0) {
            clearInterval(paste_intervalId);
            add_paste_functionality();
        }
        else {
            checkCount++;
            if (checkCount >= 10) {
                clearInterval(paste_intervalId);
            }
        }
    }

    function add_paste_functionality() {
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

                        // "Input" event makes Angular/React/Vue notice the change
                        inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
                        // inputs[i].dispatchEvent(new Event('change', { bubbles: true }));
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
}