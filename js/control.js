const remote = require('electron').remote;
const main = remote.require('./main.js');
const { ipcRenderer } = require('electron');


ipcRenderer.on('updateTime', (event, times) => {
    vue.timerRemaining = times.secsRemaining;
    vue.timerElapsed = times.secsElapsed;
});

ipcRenderer.on('timerInterval', (event, interval) => {
    vue.timerInterval = interval;
});

ipcRenderer.on('timerMode', (event, mode) => {
    vue.timerMode = mode;
});

ipcRenderer.on('updateSession', (event, sessionObj) => {
    vue.sessionTitle = sessionObj.title;
    vue.breakpointTotal = sessionObj.breakpoints.total;
    vue.breakpointAmber = sessionObj.breakpoints.amber;
    vue.breakpointRed = sessionObj.breakpoints.red;

    vue.timerMode = sessionObj.timerMode;
    vue.timerInterval = sessionObj.timerInterval;
});

var vue = new Vue({
    el: '#app',
    data: {
        sessionTitle: '',
        timerInterval: 1000,
        timerMode: 'stopped',


        timerHasGreen: true,
        timerHasAmber: true,
        timerHasRed: true,
        timerCanOverrun: true,

        timerRemaining: 0,
        timerElapsed: 0,
        timerRemainingText: secondsToString(0),
        timerElapsedText: secondsToString(0),

        breakpointTotal: 0,
        breakpointAmber: 0,
        breakpointRed: 0,
        breakpointTotalText: secondsToString(0),
        breakpointAmberText: secondsToString(0),
        breakpointRedText: secondsToString(0),

        currentBreakpoint: 'total',
        progressBarPosition: 100, //In Pixels

        sliderTestInput: 0,

        progressBarClass: 'has-green-amber-red-over'

    },

    methods: {
        openPrefs: function() {
            main.openPrefs();
        },
        startTimer: function() {
            main.startTimer();
        },
        pauseTimer: function() {
            main.pauseTimer();
        },
        stopTimer: function() {
            main.stopTimer();
        },
        setSpeed: function(speed) {
            main.setSpeed(speed);
        },
        newOutputWindow: function() {
            main.newOutputWindow();
        },

        calculateProgress: function() { //This does need refactoring. It's just here to see how we like it
            var greenWidth = this.timerHasGreen ? $('.progress-bar-green').first().outerWidth() : 0;
            var amberWidth = this.timerHasAmber ? $('.progress-bar-amber').first().outerWidth() : 0;
            var redWidth = this.timerHasRed ? $('.progress-bar-red').first().outerWidth() : 0;

            if (this.timerRemaining < 0) {
                this.progressBarPosition = greenWidth + amberWidth + redWidth;
                return;
            }

            if (this.timerHasGreen) {
                var greenLengh = this.breakpointTotal - this.breakpointAmber;
                var positionInGreen = this.timerElapsed;
                var progressThroughGreen = positionInGreen / greenLengh;

                if (progressThroughGreen <= 1 && progressThroughGreen > 0) {
                    this.progressBarPosition = Math.floor(progressThroughGreen * greenWidth);
                    return;
                }
            }

            if (this.timerHasAmber) {
                var amberLength = this.breakpointAmber - this.breakpointRed;
                var positionInAmber = this.timerElapsed - greenLengh;
                var progressThroughAmber = positionInAmber / amberLength;

                if (progressThroughAmber <= 1 && progressThroughAmber > 0) {
                    this.progressBarPosition = Math.floor(progressThroughAmber * amberWidth + greenWidth);
                    return;
                }
            }


            if (this.timerHasRed) {
                var redLength = this.breakpointRed;
                var positionInRed = this.timerElapsed - amberLength - greenLengh;
                var progressThroughRed = positionInRed / redLength;

                if (progressThroughRed <= 1 && progressThroughRed > 0) {
                    this.progressBarPosition = Math.floor(progressThroughRed * redWidth + amberWidth + greenWidth);
                    return;
                }
            }
        }
    },

    watch: {
        timerRemaining: function() {
            this.timerRemainingText = secondsToString(this.timerRemaining);
        },
        timerElapsed: function() {
            this.timerElapsedText = secondsToString(this.timerElapsed);
        },
        breakpointTotal: function() {
            this.breakpointTotalText = secondsToString(this.breakpointTotal);
        },
        breakpointAmber: function() {
            this.breakpointAmberText = secondsToString(this.breakpointAmber);
        },
        breakpointRed: function() {
            this.breakpointRedText = secondsToString(this.breakpointRed);
        },

        sliderTestInput: function() {
            this.timerElapsed = parseInt(this.sliderTestInput);
            this.timerRemaining = this.breakpointTotal - this.timerElapsed;
            this.calculateProgress();
        },

        timerHasGreen: calculateProgressClass,
        timerHasAmber: calculateProgressClass,
        timerHasRed: calculateProgressClass,
        timerCanOverrun: calculateProgressClass

    },
    mounted: function() {
        main.getSession();
    }
});

function calculateProgressClass() {
    this.progressBarClass = 'has' + (this.timerHasGreen ? '-green' : '') + (this.timerHasAmber ? '-amber' : '') + (this.timerHasRed ? '-red' : '') + (this.timerCanOverrun ? '-over' : '');
}


function secondsToString(seconds) {
    var h, m, s;
    var outString = '';

    if (seconds < 0) {
        seconds = Math.abs(seconds);
        outString += '- ';
    }

    h = Math.floor(seconds / 3600);
    m = Math.floor(seconds % 3600 / 60);
    s = Math.floor(seconds % 3600 % 60);

    outString += h > 0 ? h + ':' : '';
    outString += m < 10 ? '0' + m : m;
    outString += ':';
    outString += s < 10 ? '0' + s : s;

    return outString;
}
