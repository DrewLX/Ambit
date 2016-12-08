const remote = require('electron').remote
const main = remote.require('./main.js')
const settings = require('electron-settings');
const {ipcRenderer} = require('electron')

settings.configure({ prettify: true })

function saveSettings() {
	settings.setSync('defaultTimerDuration', vue.defaultTimerDuration)
	settings.setSync('oscPort', parseInt(vue.oscPort))
}

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
				saveSettings();
				var window = remote.getCurrentWindow();
				window.close();
      },
			prefsApply: function() {
				// save changes
				saveSettings();
      },
		},

	})
