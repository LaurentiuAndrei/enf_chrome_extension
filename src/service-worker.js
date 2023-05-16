var urlFilter = {
	url: [{ hostEquals: "admin.enf.me" }]
};

chrome.webNavigation.onDOMContentLoaded.addListener(function (tab) {
	var tabId = tab.tabId;
	var url = tab.url;

    if (url.includes("admin.enf.me/solar/ID/edit")) {
        console.log("on basic page");
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: ["src/company/company.js"],
		});
		chrome.scripting.insertCSS({
			target: { tabId: tabId },
			files: ["src/company/company.css"],
		});
	} else if (url.includes("admin.enf.me/solar/ID/classification")) {
		console.log("on classification page");
	} else { console.log("we are on: " + url)}
}, urlFilter);