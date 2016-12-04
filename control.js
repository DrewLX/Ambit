const remote = require('electron').remote
const main = remote.require('./main.js')

const {ipcRenderer} = require('electron')


	var app = new Vue({
	  el: '#app',
	  data: {
	    message: 'Hello Vue!'
	  },

    methods: {
			NewOutputWindow: function() {
        main.NewOutputWindow()
      },
			NewOutputFullscreen: function() {
				main.NewOutputFullscreen()
			}
    }
	})
