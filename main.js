const {app, BrowserWindow} = require("electron");
const crawler = require("./assets/js/crappy-crawler.js");

function init() {
	let url = "https://animo.sys.dlsu.edu.ph/psp/ps/?cmd=login";
	let inject = [`
		location = "https://animo.sys.dlsu.edu.ph/psp/ps/?cmd=login";
		crappy_crawler_data = "- REDIRECT"
	`,`
		setInterval(_ => {
			try {
				console.log(document, document.getElementById("userid"))
				document.getElementById("userid").value = "ID_NUMBER";
				document.getElementById("pwd").value = "PASSWORD";
				document.getElementsByClassName("psloginbutton")[0].click();
			} catch(_) {}
		}, 100);
		crappy_crawler_data = "- LOGIN"
	`,`
		location = "https://animo.sys.dlsu.edu.ph/psc/ps/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_CART.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_ENROLLMENT.HC_SSR_SSENRL_CART_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder&PortalActualURL=https%3a%2f%2fanimo.sys.dlsu.edu.ph%2fpsc%2fps%2fEMPLOYEE%2fHRMS%2fc%2fSA_LEARNER_SERVICES.SSR_SSENRL_CART.GBL&PortalContentURL=https%3a%2f%2fanimo.sys.dlsu.edu.ph%2fpsc%2fps%2fEMPLOYEE%2fHRMS%2fc%2fSA_LEARNER_SERVICES.SSR_SSENRL_CART.GBL&PortalContentProvider=HRMS&PortalCRefLabel=Enrollment%3a%20%20Add%20Classes&PortalRegistryName=EMPLOYEE&PortalServletURI=https%3a%2f%2fanimo.sys.dlsu.edu.ph%2fpsp%2fps%2f&PortalURI=https%3a%2f%2fanimo.sys.dlsu.edu.ph%2fpsc%2fps%2f&PortalHostNode=HRMS&NoCrumbs=yes&PortalKeyStruct=yes"
		crappy_crawler_data = "- ADD COURSE"
	`,`
		setInterval(_ => {
			try {
				document.getElementsByClassName("SSSBUTTON_CONFIRMLINK")[1].click();
			} catch(_) {}
		}, 100);
		crappy_crawler_data = "- CART"
	`,`
		setInterval(_ => {
			try {
				let l = document.getElementsByClassName("SSSBUTTON_CONFIRMLINK");

				for (let i = 0; i < l.length; i++)
					if (l[i].innerText == "Finish Enrolling")
						l[i].click();
			} catch(_) {}
		}, 100);
		crappy_crawler_data = "- PROCESS"
	`,`
		crappy_crawler_data = "- ENROLL";
	`];
	let callback = i => {
		console.log(i)
	};

	console.log("Enrolling...\nAttempt # 1", "|", new Date());

	let interval = 2 * 60 * 1000; // 1 minute per session.
	let lifetime = interval - 100; // 100ms intermission before starting a new session.
	let attempts = 2;
	crawler(url, inject, callback, lifetime);

	let loop = setInterval(_ => {
		console.log("\nAttempt #", attempts++, "|", new Date());
		crawler(url, inject, callback, lifetime);
	}, interval);

	let win = new BrowserWindow({
		width: 360,
		height: 0,
		minWidth: 360,
		minHeight: 0,
		title: "Placeholder (DO NOT CLOSE)",
		webPreferences: {
			nodeIntegration: false
		}
	});

	// win.setMenu(null);
	// win.loadFile("index.html");
	// win.loadURL("");
	win.on("closed", () => win = null);
}

app.on("ready", init);

app.on("window-all-closed", () =>
	process.platform !== "darwin" && app.quit()
);

app.on("activate", init);
