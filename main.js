const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
var os = require('os');
var log = require('electron-log');
var timer = require('timers');
var osc = require('node-osc');
var fs = require('fs');

var currentTimer = null // will be used for our timer object

let control = null // this will be control window
let win = null // this will be display window...

global.shared = {
	secsRemaining: 600,
	secsElapsed: 0,
	timerInterval: 1000,
	timerMode: 'Stopped'
}

var dir = app.getPath('documents') + '/Period/';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
log.transports.file.file = dir + 'log.txt';


app.on('ready', () => {
	control = new BrowserWindow({width:800, height:900})
	control.loadURL('file://' + __dirname + '/control.html')
	control.webContents.openDevTools()

	log.info('Period App Launched');

	control.on('closed', () => {
		app.quit();
	})
})

app.on('will-quit', () => {
	log.info('Period Quit')
})


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//      T I M E R     F U N C T I O N S
exports.StartTimer = () => {
	currentTimer = timer.setInterval(doTimer, global.shared.timerInterval)
	global.shared.timerMode = 'Running'
	control.webContents.send('timerMode', global.shared.timerMode)
	log.info('Timer Started')
}

exports.PauseTimer = () => {
	timer.clearInterval(currentTimer)
	global.shared.timerMode = 'Paused'
	control.webContents.send('timerMode', global.shared.timerMode)
	log.info('Timer Paused')
}

exports.StopTimer = () => {
	timer.clearInterval(currentTimer)
	global.shared.secsRemaining = 600
	global.shared.secsElapsed = 0;
	updateTime()
	global.shared.timerMode = 'Stopped'
	control.webContents.send('timerMode', global.shared.timerMode)
	log.info('Timer Stopped')
}

exports.SetSpeed = (speed) => {
	if (global.shared.timerMode == 'Running') {
		timer.clearInterval(currentTimer)
		global.shared.timerInterval = speed;
		currentTimer = timer.setInterval(doTimer, global.shared.timerInterval)
	} else {
		global.shared.timerInterval = speed;
	}
	control.webContents.send('timerInterval', global.shared.timerInterval)
	log.info('Speed Set:' + speed)
}

function doTimer() {
	global.shared.secsRemaining--;
	global.shared.secsElapsed++;
	updateTime();
}

function updateTime() {
	// update time on any current displays
	control.webContents.send('updateTime', global.shared.secsRemaining) // update control window
	if (win !== null) {
		win.webContents.send('updateTime', global.shared.secsRemaining) // update display window
	}
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//            W I N D O W     F U N C T I O N S
exports.NewOutputWindow = () => {
	win = new BrowserWindow({width: 640, height: 360})
	win.loadURL('file://' + __dirname + '/display.html')
	//win.webContents.openDevTools()
	log.info('New Output Window Launched (ID: ' + win.id + ')')


	win.on('closed', () => {
		win = null
		log.info('Output Window Closed')
	})
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//            O S C     S E R V E R
var oscServer = new osc.Server(3333, '0.0.0.0');

oscServer.on("/timer/start", function (msg, rinfo) {
	log.info("OSC Received: /timer/start");
	exports.StartTimer();
});

oscServer.on("/timer/pause", function (msg, rinfo) {
	log.info("OSC Received: /timer/pause");
	exports.PauseTimer();
});

oscServer.on("/timer/stop", function (msg, rinfo) {
	log.info("OSC Received: /timer/stop");
	exports.StopTimer();
});

oscServer.on("/timer/speed", function (msg, rinfo) {
	log.info("OSC Received: /timer/speed - Setting to: " + msg[1]);
	exports.SetSpeed(msg[1]);
});
