const {ipcMain, BrowserWindow} = require("electron");
const counter = require("./counter.js");
const hooker = require("./hooker.js");

const sig = Math.random() + "watcher";

module.exports = function(url) {
	let hook = new hooker();
	let id = counter();
	let sigid = sig+id;
	let get = {};

	let win = new BrowserWindow({
		//show: false
	});
	let web = win.webContents;

	let ipcMain_on = (event, pair) => {
		if (get[pair.key]) {
			get[pair.key].map(v => v(pair.value));
			delete get[pair.key];
		}
	};

	ipcMain.on(sigid, ipcMain_on);

	web.once("destroyed", _ => {
		counter(id);

		ipcMain.removeListener(sigid, ipcMain_on);

		hook.fire("destroyed");
	});

	web.on("did-finish-load", _ => {
		web.executeJavaScript(`{
			let {ipcRenderer} = require("electron");

			ipcRenderer.on(
				"` + sigid + `", (event, key) => {
					ipcRenderer.send("` + sigid + `", {
						key,
						value: window[key]
					});
				}
			);
		}`);

		hook.fire("did-finish-load");
	});
	win.loadURL(url);

	this.get = (key, callback) => {
		if (!get[key])
			get[key] = [];

		get[key].push(callback);
		web.send(sigid, key);
	};

	this.on = hook.on;

	this.once = hook.once;

	this.removeListener = hook.removeListener;

	this.loadURL = url => win.loadURL(url);

	this.inject = (code, userGesture, callback) => {
		web.executeJavaScript(code, userGesture, callback);
	};

	this.destroy = _ => {
		web.session.clearStorageData();
		web.session.clearCache(_ => _);
		web.session.clearHostResolverCache();
		win.destroy();
	};
};
