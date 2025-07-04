// Delete empty div from the form
let checkCount = 0;
const maxCheck = 10;
const checkInterval = 500; // in milliseconds

// INIT
trigger_interval_check();
watch_add_model_button(); // <<--- IMPORTANT, run on page load/init!

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
        } else {
            checkCount++;
            if (checkCount >= maxCheck) {
                clearInterval(intervalId); // stop checking after 5 times
                alert('sidebar did not load within 5 seconds, please refresh');
            }
        }
    }, checkInterval);
}

function add_ul_click_handler() {
    let ulElement = document.querySelector('#enf-ams-fromenf-sidebar > ul');
    ulElement.addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            trigger_interval_check();
        }
    });
}

function create_container() {
    var navbar = document.querySelector('form > div:nth-child(1)');
    var sidebar = document.querySelector('form > div:nth-child(2)');
    var content = document.querySelector('form > div:nth-child(3)');
    sidebar.classList.add('loaded');

    var newDiv = document.createElement('div');
    newDiv.id = 'main_content';
    sidebar.parentNode.insertBefore(newDiv, sidebar);
    newDiv.appendChild(navbar);
    newDiv.appendChild(content);
    create_sidebar_toggle_button(sidebar, navbar);
    add_new_paste();
}

function create_sidebar_toggle_button(sidebar, navbar) {
    var btn = document.createElement("button");
    btn.innerHTML = "⚙️ Hide Sidebar";
    btn.classList.add("btn");
    btn.id = "toggle_sidebar";
    navbar.firstElementChild.appendChild(btn);
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

// --- THIS IS THE MAIN PASTE LOGIC ---
function add_new_paste() {
    checkCount = 0;
    let parentTable;
    let inputs;

    // Wait until the table and input fields appear
    const paste_intervalId = setInterval(find_table_and_fields, 500);
    function find_table_and_fields() {
        parentTable = document.querySelector('table');
        inputs = Array.from(parentTable ? parentTable.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])') : []);
        if (parentTable && inputs.length > 0) {
            clearInterval(paste_intervalId);
            add_paste_visual_class();
            add_paste_functionality(parentTable, inputs);
        } else {
            checkCount++;
            if (checkCount >= 10) {
                clearInterval(paste_intervalId);
            }
        }
    }
}

// Visually mark all current relevant inputs
function add_paste_visual_class() {
    const inputs = document.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])');
    inputs.forEach(input => input.classList.add('paste_ready_input'));
}

// Core event logic for pasting; uses per-row dynamic column counting
function add_paste_functionality(parentTable, inputsInitial) {
    // Remove previous event listeners to avoid duplicate attaches (optional, advanced)
    // parentTable.removeEventListener('__customPasteListener__', ...);

    parentTable.addEventListener('paste', function (e) {
        // Use up-to-date inputs set:
        const allInputs = Array.from(parentTable.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])'));
        if (!allInputs.includes(e.target)) return;
        e.preventDefault();

        var clipboardData = e.clipboardData || window.clipboardData;
        var pastedText = clipboardData.getData('text');
        pastedText = pastedText.replace(/[^0-9. ]/g, "");
        var splitText = pastedText.trim().split(/\s+/);

        // Per-row logic
        var tr = e.target.closest('tr');
        if (!tr) return;
        var rowInputs = Array.from(tr.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])'));
        var rowIdx = rowInputs.indexOf(e.target);
        var maxCols = rowInputs.length - rowIdx;
        if (splitText.length > maxCols) {
            alert(`You're pasting ${splitText.length} values, but only ${maxCols} columns remain in this row`);
            return;
        }
        for (var i = 0; i < splitText.length; i++) {
            var field = rowInputs[rowIdx + i];
            if (field) {
                field.value = splitText[i];
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    });
}

// --- HANDLE ADDING NEW COLUMNS ---
function watch_add_model_button() {
    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('add-models-popover-button')) {
            // POLL UNTIL new fields exist
            let tries = 0;
            let oldInputCount = document.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])').length;
            let poll = setInterval(() => {
                let currentInputCount = document.querySelectorAll('input[ng-class="modelInputClass"]:not([ng-model="model.model_no"])').length;
                if (currentInputCount > oldInputCount) {
                    clearInterval(poll);
                    add_paste_visual_class(); // Just add visual styling for new fields!
                }
                if (++tries > 30) { // timeout after 3s
                    clearInterval(poll);
                }
            }, 100);
        }
    });
}