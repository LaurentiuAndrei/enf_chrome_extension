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

function modify_on_off_grid(category, label) {
    const labels = label.querySelectorAll('.row > label');
    
    if(category.textContent.includes('Solar System Installers')) {
        labels.forEach(label => {
            // Rename label
            if(label.textContent == 'On/Off Grid:') {
                label.textContent = 'Battery Storage';
            }
            // Remove unused 'On-Grid'
            const on_grid = label.parentElement.querySelector('.rrow > input[value="g"]');

            if(on_grid) {
                const rrow = on_grid.parentElement;
                on_grid.remove();
                // Replacing the "label" of the on-grid with nothing ""
                rrow.innerHTML = rrow.innerHTML.replace(/On-grid&nbsp;&nbsp;/g, "");
                // Rename "Off-grid" to "Yes"
                rrow.innerHTML = rrow.innerHTML.replace("Off-grid", "Yes");
            }
        });
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