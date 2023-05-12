chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status != "complete") return;

    let url = tab.url;

    console.log("current tab URL is: " + url);

	if (url.includes("admin.enf.me/solar/ID/edit")) {
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			files: ["src/company/company.js"]
		});
        chrome.scripting.insertCSS({
            target: {tabId: tabId},
            files: ["src/company/company.css"]
        });
        console.log("on company basic page");
	}
    else if(url.includes("admin.enf.me/solar/ID/classification")) {
		console.log("on classification page");
	}
});