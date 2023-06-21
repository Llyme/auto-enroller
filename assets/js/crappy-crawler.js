/**
 * Will inject scripts in sites for crawlies.
 * Use `crappy_crawler_data` as the return value.
**/
const {ipcMain, BrowserWindow} = require("electron");
const counter = require("./counter.js")

const sig = "crappy-crawler";
const queue = {};
// Automatically aborted if past 30 seconds.
const lifetime_def = 30000;

module.exports = (url, inject, callback, lifetime) => {
	let id = counter();
	let sigid = sig+id;
	let step = 0;

	let win = new BrowserWindow({
		//show: false
	});
	let web = win.webContents;

	setTimeout(_ => {
		if (!win.isDestroyed()) {
			callback = null;
			win.destroy();
			counter(id);
		}
	}, lifetime || lifetime_def);

	let fn = _ => {
		ipcMain.once(sigid, (event, arg) =>
			callback && callback(arg)
		);

		web.executeJavaScript(inject[step++]);
		web.executeJavaScript(`
			try {
				if (crappy_crawler_data != null)
					require("electron").ipcRenderer.send(
						"` + sigid + `",
						crappy_crawler_data
					);

				crappy_crawler_data = null;
			} catch(_) {}
		`);

		if (step < inject.length)
			web.once("did-finish-load", fn);
		else {
			counter(id);
			win.destroy();
		}
	}

	web.once("did-finish-load", fn);
	win.loadURL(url);
};
