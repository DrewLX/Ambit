const electron = require('electron')
const {app, BrowserWindow, ipcMain} = electron
var os = require('os')
var log = require('electron-log');
var timer = require('timers')

var secsRemaining = 600
var currentTimer = null

let control = null // this will be control window
let win = null // this will be display window...

log.info('Period App Launched');

app.on('ready', () => {
	control = new BrowserWindow({width:800, height:900})
	control.loadURL('file://' + __dirname + '/control.html')
	control.webContents.openDevTools()
})

app.on('will-quit', () => {
	log.info('Period Quit')
})


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//      T I M E R     F U N C T I O N S
exports.StartTimer = () => {
	log.info('Timer Started')
	currentTimer = timer.setInterval(doTimer, 1000)
}

exports.PauseTimer = () => {
	timer.clearInterval(currentTimer)
	log.info('Timer Paused')
}

exports.StopTimer = () => {
	timer.clearInterval(currentTimer)
	secsRemaining = 600
	updateTime()
	log.info('Timer Stopped')
}

function doTimer() {
	secsRemaining--;
	updateTime();
}

function updateTime() {
	// update time on any current displays
	control.webContents.send('updateTime', secsRemaining) // update control window
	win.webContents.send('updateTime', secsRemaining) // update display window
	log.info(secsRemaining)
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//            W I N D O W     F U N C T I O N S
exports.NewOutputWindow = () => {
	win = new BrowserWindow({width: 640, height: 360})
	win.loadURL('file://' + __dirname + '/display.html')
	win.webContents.openDevTools()
	log.info('New Output Window Launched (ID: ' + win.id + ')')


	win.on('closed', () => {
		win = null
		log.info('Output Window Closed')
	})
}
