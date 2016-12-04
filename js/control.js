const remote = require('electron').remote
const main = remote.require('./main.js')

const {ipcRenderer} = require('electron')

ipcRenderer.on('updateTime', (event, message) => {
	vue.secsRemaining=message;
	console.log('updateTime Run')
})

	var vue = new Vue({
	  el: '#app',
	  data: {
	    secsRemaining: 60
	  },

    methods: {
			StartTimer: function() {
        main.StartTimer()
      },
			PauseTimer: function() {
        main.PauseTimer()
      },
			StopTimer: function() {
        main.StopTimer()
      },
			NewOutputWindow: function() {
        main.NewOutputWindow()
      },

    }
	})
