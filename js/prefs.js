const remote = require('electron').remote
const main = remote.require('./main.js')
const settings = require('electron-settings');
const {ipcRenderer} = require('electron')



	var vue = new Vue({
	  el: '#app',
	  data: {
	    defaultTimerDuration: settings.getSync('defaultTimerDuration'),
			oscPort: settings.getSync('oscPort'),
	  },

    methods: {
			prefsCancel: function() {
	        // cancel any changes and close the window..
					var window = remote.getCurrentWindow();
       		window.close();
      },
			prefsSave: function() {
        // save changes and close the window...
				vue.prefsApply()
				vue.prefsCancel();
      },
			prefsApply: function() {
				// save changes
				settings.set('defaultTimerDuration', vue.defaultTimerDuration)
				settings.set('oscPort', vue.oscPort)
      },
		},

	})
