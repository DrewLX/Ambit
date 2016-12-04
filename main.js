const electron = require('electron')
const {app, BrowserWindow} = electron
var os = require('os')
var log = require('electron-log');


global.timer = {
	secsRemaining: 900
}


log.info('Period App Launched');

app.on('ready', () => {
	let control = new BrowserWindow({width:800, height:900})
	control.loadURL('file://' + __dirname + '/control.html')

	control.webContents.openDevTools()
})

app.on('will-quit', () => {
	log.info('Period Quit')
})


exports.NewOutputWindow = () => {
	let win = new BrowserWindow({width: 640, height: 360})
	win.loadURL('file://' + __dirname + '/display.html')
	win.webContents.openDevTools()
	log.info('New Output Window Launched (ID: ' + win.id + ')')


	win.on('closed', () => {
		win = null
		log.info('Output Window Closed')
	})
}


	exports.NewOutputFullscreen = () => {
		let win = new BrowserWindow({width: 640, height: 480, fullscreen: true})
		win.loadURL('file://' + __dirname + '/display.html')
		log.info('New Output Fullscreen Launched (ID: ' + win.id + ')')

		win.on('closed', () => {
			win = null
			log.info('Output Screen Closed')
		})
	}
