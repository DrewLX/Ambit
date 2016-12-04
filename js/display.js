const remote = require('electron').remote
const main = remote.require('./main.js')
const {ipcRenderer} = require('electron')

os = require('os')

ipcRenderer.on('updateTime', (event, message) => {
	vue.secsRemaining=message;
})

	var vue = new Vue({
	  el: '#app',
	  data: {
	    secsRemaining: remote.getGlobal('shared').secsRemaining
	  },

	})
