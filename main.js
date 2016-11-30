const electron = require('electron')
const {app, BrowserWindow} = electron

var log = require('electron-log');


log.info('Period App Launched');

app.on('ready', () => {
	let win = new BrowserWindow({width:800, height:600})
	win.loadURL('file://' + __dirname + '/control.html')

	win.webContents.openDevTools()
})


exports.NewOutputWindow = () => {
	let win = new BrowserWindow({width: 640, height: 360})
	win.loadURL('file://' + __dirname + '/display.html')
	log.info('New Output Window Launched')
}
