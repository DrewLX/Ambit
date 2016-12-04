const remote = require('electron').remote
const main = remote.require('./main.js')
const {ipcRenderer} = require('electron')

os = require('os')



	var app = new Vue({
	  el: '#app',
	  data: {
	    secsRemaining: remote.getGlobal('timer').secsRemaining
	  },

	})
