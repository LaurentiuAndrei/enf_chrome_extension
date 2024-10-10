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

                    if(e.target.textContent.includes('Solar System Installers')) {
                        update_installer_fields(container);
                    }

                } else if (checkCount >= totalChecks) {
                    console.warn('Data for the selected category not found.');
                    clearInterval(checkInterval);
                }
            }, 1000);
        }
    });
}


function update_installer_fields(label) {
    if (company_updated()) {
        const fields_to_remove = [
            "Installation Starting Date:",
            "Countries Operating In:",
            "Region / Continent Operating In:"
        ]
        const fields_to_hide = [
            "S_M:",
            "Battery Storage:"
        ]
    
        remove_unused_fields(fields_to_remove)
        hide_unused_fields(fields_to_hide)
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

function is_company_installer() {
    for(elem of HEADERS) {
        if(elem.textContent.toLowerCase().includes('installer')) {
            return true
        }
    }

    return false
}

function company_updated() {
    let fields = document.querySelectorAll("div.row");

    for (let field of fields) {
        let firstLabel = field.querySelector("label")

        if (firstLabel) {
            if (firstLabel.textContent == "Updata By") {
                return true
            }
        }
    }

    return false
}


function hide_unused_fields(array) {
	const labels = document.querySelectorAll(".row > label");

	labels.forEach((label) => {
		if (array.includes(label.textContent)) {
			label.parentElement.classList.add('hidden');
		}
	});
}