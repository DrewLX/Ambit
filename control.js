const remote = require('electron').remote
const main = remote.require('./main.js')



	var app = new Vue({
	  el: '#app',
	  data: {
	    message: 'Hello Vue!'
	  },

    methods: {
      NewOutputWindow: function() {
        main.NewOutputWindow()
      }
    }
	})
