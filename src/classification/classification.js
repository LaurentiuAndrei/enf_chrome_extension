const HEADERS = document.querySelectorAll("section h3");

const unused_fields = [
    "Minimum Order Volume:"
];

remove_unused_elements();
add_click_listener_section_h3();
click_first_category();

// ----------------
// Function definitions below
// ----------------
function add_click_listener_section_h3() {
    const displayTable = document.querySelector('.displaytable');

    displayTable.addEventListener('click', function(e) {
        if(e.target.tagName === 'H3') {
            let checkCount = 0;
            const totalChecks = 5;
            const checkInterval = setInterval(() => {
                checkCount++;

                container = e.target.parentElement.querySelector(".mid_sec > fieldset");

                if (container) {
                    // Remove all the <br> elements from the entire page
                    const brs = remove_all_br_elements();
                    console.info(`Removed ${brs} from the page.`);
                    clearInterval(checkInterval);

                    // Alter the On/Off Grid field
                    modify_on_off_grid(e.target, container);

                    // Half the height of the fieldset to create 2 columns in the flex-container
                    // create_columns(container);

                } else if (checkCount >= totalChecks) {
                    console.warn('Data for the selected category not found.');
                    clearInterval(checkInterval);
                }
            }, 1000);
        }
    });
}

function create_columns(container) {
    const height = container.clientHeight;
    container.style.height = height / 2 + 'px';
}

// Summary: rename label, remove a checkbox, edit the 'context' of the remaining checkbox
function modify_on_off_grid(category, label) {
    const labels = label.querySelectorAll('.row > label');
    
    if(category.textContent.includes('Solar System Installers')) {
        for(let label of labels) {
            // Exit if we have the wrong field
            if(label.textContent != 'On/Off Grid:') {
                continue;
            }
            
            // Rename label
            label.textContent = 'Battery Storage';

            // Select the 'off-grid' / battery storage checkbox
            let batteryStorageCheckbox = label.parentElement.querySelector('input[type="checkbox"][name="grid"][value="o"]');
            let is_battery_storage = batteryStorageCheckbox.checked;

            // Remove unused 'On-Grid'
            const onGridCheckbox = label.parentElement.querySelector('input[type="checkbox"][name="grid"][value="g"]');
            const checkboxParent = onGridCheckbox.parentElement;

            // Remove the "on-grid" input checkbox
            if(onGridCheckbox)
                onGridCheckbox.remove();

            // Scan the children of the parent of the inputs to remove all TEXT_NODES
            Array.from(checkboxParent.childNodes).forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    checkboxParent.removeChild(node);
                }
            });

            // Reassign the initial value of the battery storage
            is_battery_storage ? batteryStorageCheckbox.setAttribute('checked', 'checked') : batteryStorageCheckbox.removeAttribute('checked');
            
            // Add context for the remaining input checkbox
            checkboxParent.innerHTML += "Yes"; 
            break;
        };
    }
}

function remove_unused_elements() {
	const elementsToRemove = [
		"body > div > div.top_line",
		"#navbar-container > div",
		"#navbar-content-title",
	];

	for (element of elementsToRemove) {
		try {
			document.querySelector(element).remove();
		} catch (error) {
			console.error(`An error occured:${error}`);
		}
	}
}

function remove_all_br_elements() {
	const elements = document.querySelectorAll("br");
    const count = elements.length;

	elements.forEach((elem) => {
		elem.remove();
	});

    return count;
}

// not using this function at the moment, but keeping it
function remove_unused_fields(array) {
	const labels = document.querySelectorAll(".row > label");

	labels.forEach((label) => {
		if (array.includes(label.textContent)) {
			label.parentElement.remove();
		}
	});
}

function click_first_category() {
	if (HEADERS[0]) {
		HEADERS[0].click();
	} else {
		console.log("[LOG] The 'section h3' element was not found.");
	}
}