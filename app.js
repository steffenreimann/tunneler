const electron = require('electron');
const path = require('path');
const url = require('url');
const fm = require('easy-nodejs-app-settings');
const cd = require('easy-electron-custom-dialog');
const st = require('./spawnSSH.js');
const os = require('os');
const userHomeDir = os.homedir();
// SET ENV
process.env.NODE_ENV = 'development';
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;

app.on('ready', function() {
	// Create new window
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 500,
		title: 'tunneler',
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'public/index.html'),
			protocol: 'file:',
			slashes: true,
			title: 'tunneler'
		})
	);

	// Quit app when closed
	mainWindow.on('closed', function() {
		app.quit();
	});

	mainWindow.on('minimize', function(event) {});

	mainWindow.on('restore', function(event) {});
	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
	mainWindow.toggleDevTools();
});

// Create menu template
const mainMenuTemplate = [
	// Each object is a dropdown
	{
		label: 'Application',
		submenu: [
			{ label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
			{ type: 'separator' },
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				click: function() {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
			{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
			{ type: 'separator' },
			{
				label: 'Test Function Call',
				accelerator: 'CmdOrCtrl+S',
				click: function() {
					testFunction();
				}
			},
			{ type: 'separator' },
			{ label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
			{ label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
			{ label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
			{ label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
		]
	}
];

// If OSX, add empty object to menu
if (process.platform == 'darwin') {
	// mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				role: 'reload'
			},
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}
var DataStore;
async function init() {
	DataStore = new fm.File({
		appname: 'tunneler', // required
		file: 'DataStore.json', // required
		data: { tunnels: {} }, // Optional, Set Data on Init only if the file is newly created or overwriteOnInit is true
		overwriteOnInit: true, // Optional, Set true if you want to overwrite the file on init. Attention the whole file will be overwritten!
		interval: 5000, // Optional, if not set the interval no File watcher will be created
		doLogging: false // Optional
	});

	await DataStore.init();
	console.log('DataStore File Init Done! File path: ', DataStore.path);
	//console.log(DataStore.data);

	for await (let key of Object.keys(DataStore.data.tunnels)) {
		var element = DataStore.data.tunnels[key];
		if (element.connectOnStartup) {
			//await st.connect(element.key);
			st.openTunnel(element.key, function(data) {
				//console.log(data);
			});
		}
	}
}

ipcMain.handle('TestEvent', async (event, data) => {
	console.log(data);
	return data;
});

ipcMain.handle('openpath', async (event, data) => {
	//console.log(data);
	//open file with dialog
	return await dialog.showOpenDialog({ properties: [ 'openFile' ], defaultPath: path.join(os.homedir(), '.ssh') });
});

ipcMain.handle('sshkeygen', async (event, data) => {
	console.log('sshkeygen');
	//open file with dialog
	return await cd.dialog({
		width: 500,
		height: 500,
		title: 'sshkeygen',
		htmlPath: path.join(__dirname, 'public/dialog.html'),
		data: {
			test: 'ja min'
		},
		cb: function(data) {
			console.log('Dialog callback = ', data);
		}
	});
	//return await dialog.showOpenDialog({ properties: [ 'openFile' ], defaultPath: path.join(os.homedir(), '.ssh') });
});

ipcMain.handle('addTunnel', async (event, data) => {
	console.log(data);

	//console.log('tunnel', tunnel);
	var isNew = true;

	for await (let key of Object.keys(DataStore.data.tunnels)) {
		if (data.host == DataStore.data.tunnels[key].host && data.remotePort == DataStore.data.tunnels[key].remotePort && data.username == DataStore.data.tunnels[key].username) {
			isNew = false;
		}
	}
	if (isNew) {
		var tunnel = {};
		tunnel[data.id] = data;
		await DataStore.push({ tunnels: tunnel });
	}

	var obj = await mergeFileTunnelsAndConnectedTunnels();
	//console.log('addTunnel', obj);

	return obj;
});

ipcMain.handle('connectTunnel', async (event, data) => {
	console.log(data);
	//var tunnel = {};
	//tunnel[data.id] = data;
	//console.log('tunnel', tunnel);
	//await DataStore.push({ tunnels: tunnel });

	st.openTunnel(DataStore.data.tunnels[data], function(data) {
		console.log(data);
	});
	var obj = await mergeFileTunnelsAndConnectedTunnels();
	//console.log('addTunnel', obj);

	return obj;
});

ipcMain.handle('getTunnels', async (event, data) => {
	var obj = await mergeFileTunnelsAndConnectedTunnels();
	//console.log('getTunnels', obj);

	return obj;
});

async function mergeFileTunnelsAndConnectedTunnels() {
	var newObj = DataStore.data.tunnels;

	for await (let key of Object.keys(DataStore.data.tunnels)) {
		var element = DataStore.data.tunnels[key];
		if (typeof st.connections[key] != 'undefined') {
			newObj[key].connected = true;
		} else {
			newObj[key].connected = false;
		}
	}
	return newObj;
}

// This is the Test Function that you can call from Menu
var i = 0;
function testFunction(params) {
	i++;
	console.log('You Click in Menu the Test Button i = ', i);
	mainWindow.send('TestEvent', i);
}

init();
