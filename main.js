const electron = require('electron')
const {app, BrowserWindow} = electron

var log = require('electron-log');


log.info('Period App Launched');

app.on('ready', () => {
	let win = new BrowserWindow({width:800, height:600})
	win.loadURL('file://' + __dirname + '/index.html')

	//win.webContents.openDevTools()
})
