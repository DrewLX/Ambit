const remote = require('electron').remote
const main = remote.require('./main.js')
const {ipcRenderer} = require('electron')

var os = require('os')

var timer = false
var time = os.uptime()
var ptime = time-1


function doTimer() {
	while(timer==true) {
		time = os.uptime()
		if (time!=ptime) {
			console.log(time)
			ptime=time
		}
	}
}


	var app = new Vue({
	  el: '#app',
	  data: {
	    secsRemaining: 123
	  },

    methods: {
			startTimer: function() {
        timer=true;
				doTimer();
				console.log('timer started')
      },
			stopTimer: function() {
        timer=false;
				console.log('timer stopped')
      },
    }
	})
