const remote = require('electron').remote
const main = remote.require('./main.js')

const {ipcRenderer} = require('electron')

ipcRenderer.on('updateTime', (event, message) => {
	vue.secsRemaining=message;
	vue.secsElapsed=remote.getGlobal('shared').secsElapsed;
	//console.log('updateTime Run')
})
ipcRenderer.on('timerInterval', (event, message) => {
	vue.timerInterval=message;
})
ipcRenderer.on('timerMode', (event, message) => {
	vue.timerMode=message;
})

	var vue = new Vue({
	  el: '#app',
	  data: {
	    secsRemaining: remote.getGlobal('shared').secsRemaining,
			secsElapsed: remote.getGlobal('shared').secsElapsed,
			timerInterval: remote.getGlobal('shared').timerInterval,
			timerMode: remote.getGlobal('shared').timerMode,
	  },

    methods: {
			OpenPrefs: function() {
        main.OpenPrefs()
      },
			StartTimer: function() {
        main.StartTimer()
      },
			PauseTimer: function() {
        main.PauseTimer()
      },
			StopTimer: function() {
        main.StopTimer()
      },
			SetSpeed: function(speed) {
				main.SetSpeed(speed)
			},
			NewOutputWindow: function() {
        main.NewOutputWindow()
      },
		},

		computed: {
			timeRemaining: function() {
					var h = Math.floor(this.secsRemaining / 3600);
					var m = Math.floor(this.secsRemaining % 3600 / 60);
					var s = Math.floor(this.secsRemaining % 3600 % 60);

					var hh = h>0? h + "h " : "";
					return hh + m + "m " + s + "s";
			},
			timeElapsed: function() {
					var h = Math.floor(this.secsElapsed / 3600);
					var m = Math.floor(this.secsElapsed % 3600 / 60);
					var s = Math.floor(this.secsElapsed % 3600 % 60);

					var hh = h>0? h + "h " : "";
					return hh + m + "m " + s + "s";
			}
		}


	})
