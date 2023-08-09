var urlFilter = {
	url: [
        { hostEquals: "admin.enf.me" },
        { hostEquals: "bd.enfsolar.com" }
    ]
};

const urlData = [
	{
		url: "admin.enf.me/solar/ID/edit",
		jsFile: "src/company/company.js",
		cssFile: "src/company/company.css",
	},
	{
		url: "admin.enf.me/solar/ID/new",
		jsFile: "src/new_company/new_company.js",
		cssFile: "src/new_company/new_company.css",
	},
	{
		url: "admin.enf.me/solar/ID/classification",
		jsFile: "src/classification/classification.js",
		cssFile: "src/classification/classification.css",
	},
	{
		url: "bd.enfsolar.com/member/products/management/#/",
		jsFile: "src/products/products.js",
		cssFile: "src/products/products.css",
	}
];

chrome.webNavigation.onDOMContentLoaded.addListener(function(tab) {
	var tabId = tab.tabId;
	var url = tab.url;

	urlData.forEach((data) => {
		if (url.includes(data.url)) {
			chrome.scripting.executeScript({
				target: { tabId: tabId },
				files: [data.jsFile],
			});

			chrome.scripting.insertCSS({
				target: { tabId: tabId },
				files: [data.cssFile],
			});
		}
	});
}, urlFilter);

chrome.runtime.onMessage.addListener(function (request) {
	if (request.type === "strings") {
		let [website, companyName, label] = request.data;

		// add strict operator to Legal Name
		console.log(companyName);
		console.log(label);
		companyName = label === "Legal Name" ? `"${companyName}"` : companyName;
		console.log(companyName);

		// Prepare the URL
		const encodedSearchInfo = encodeURIComponent(companyName);

		chrome.tabs.create({
			url: `https://www.google.com/search?q=site:${website} ${encodedSearchInfo}`,
		});
	}
});
