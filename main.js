const electron = require('electron');
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = electron;
const settings = require('electron-settings');
var os = require('os');
var log = require('electron-log');
var timer = require('timers');
var osc = require('node-osc');
var fs = require('fs');

var currentTimer = null // will be used for our timer object

let control = null // this will be control window
let win = null // this will be display window

settings.configure({ prettify: true })
settings.defaults({
    oscPort: 3333,
    defaultTimerDuration: 600
})

global.ambit_session = {
    secsRemaining: 1200,
    //secsRemaining: settings.getSync('defaultTimerDuration')
    secsElapsed: 0,
    timerInterval: 1000,
    timerMode: 'Stopped',
    sessionProgress: 0.4, //Decimal percentage of time elapsed, range 0-1. 2 = over time 
    sessionTitle: 'Fred Smith', //User definable name for the session
    breakpoints: { total: 1200, amber: 120, red: 60 }, //Breakponts in seconds
    allowOverrun: true
}

app.on('ready', () => {
    control = new BrowserWindow({ 'minWidth': 870, 'minHeight': 600, 'width': 870, 'height': 600 });
    control.loadURL('file://' + __dirname + '/control.html');
    control.webContents.openDevTools();

    log.info('Ambit Launched');

    control.on('closed', () => {
        app.quit();
    })
})

app.on('will-quit', () => {
    log.info('Ambit Quit');
})

function sendSession() {
    var sessionObject = {
        title: ambit_session.sessionTitle,
        breakpoints: {
            total: ambit_session.breakpoints.total,
            amber: ambit_session.breakpoints.amber,
            red: ambit_session.breakpoints.red
        },
        progress: ambit_session.sessionProgress
    }
    control.webContents.send('updateSession', sessionObject);
}

exports.getSession = () => {
    sendSession();
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//      T I M E R     F U N C T I O N S
exports.startTimer = () => {
    currentTimer = timer.setInterval(doTimer, global.ambit_session.timerInterval);
    global.ambit_session.timerMode = 'Running';
    control.webContents.send('timerMode', global.ambit_session.timerMode);
    log.info('Timer Started');
}

exports.pauseTimer = () => {
    timer.clearInterval(currentTimer);
    global.ambit_session.timerMode = 'Paused';
    control.webContents.send('timerMode', global.ambit_session.timerMode);
    log.info('Timer Paused');
}

exports.stopTimer = () => {
    timer.clearInterval(currentTimer);
    global.ambit_session.secsRemaining = global.ambit_session.breakpoints.total;
    global.ambit_session.secsElapsed = 0;
    updateTime();
    global.ambit_session.timerMode = 'Stopped';
    control.webContents.send('timerMode', global.ambit_session.timerMode);
    log.info('Timer Stopped');
}

exports.setSpeed = (speed) => {
    if (global.ambit_session.timerMode == 'Running') {
        timer.clearInterval(currentTimer);
        global.ambit_session.timerInterval = speed;
        currentTimer = timer.setInterval(doTimer, global.ambit_session.timerInterval);
    } else {
        global.ambit_session.timerInterval = speed;
    }
    control.webContents.send('timerInterval', global.ambit_session.timerInterval);
    log.info('Speed Set:' + speed);
}

function doTimer() {
    global.ambit_session.secsRemaining--;
    global.ambit_session.secsElapsed++;
    updateTime();
}

function updateTime() {
    // update time on any current displays
    var timeObject = {
        secsRemaining: global.ambit_session.secsRemaining,
        secsElapsed: global.ambit_session.secsElapsed
    }

    control.webContents.send('updateTime', timeObject); // update control window
    if (win !== null) {
        win.webContents.send('updateTime', timeObject); // update display window
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//            W I N D O W     F U N C T I O N S
exports.newOutputWindow = () => {
    win = new BrowserWindow({ width: 800, height: 450 });
    win.loadURL('file://' + __dirname + '/display.html');
        //win.webContents.openDevTools()
    log.info('New Output Window Launched (ID: ' + win.id + ')');


    win.on('closed', () => {
        win = null;
        log.info('Output Window Closed');
    })
}
exports.openPrefs = () => {
    prefs = new BrowserWindow({ width: 700, height: 600 })
    prefs.loadURL('file://' + __dirname + '/prefs.html');
        //win.webContents.openDevTools()
    log.info('Preferences Opened');


    prefs.on('closed', () => {
        prefs = null;
        log.info('Prefs Window Closed');
    })
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//            O S C     S E R V E R
var oscPort = settings.getSync('oscPort')
var oscServer = new osc.Server(oscPort, '0.0.0.0');
log.info('OSC Recieving on Port: ' + oscPort);
oscServer.on("/timer/start", function(msg, rinfo) {
    log.info("OSC Received: /timer/start");
    exports.StartTimer();
});

oscServer.on("/timer/pause", function(msg, rinfo) {
    log.info("OSC Received: /timer/pause");
    exports.PauseTimer();
});

oscServer.on("/timer/stop", function(msg, rinfo) {
    log.info("OSC Received: /timer/stop");
    exports.StopTimer();
});

oscServer.on("/timer/speed", function(msg, rinfo) {
    log.info("OSC Received: /timer/speed - Setting to: " + msg[1]);
    exports.SetSpeed(msg[1]);
});
