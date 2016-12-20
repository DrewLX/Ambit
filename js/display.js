const remote = require('electron').remote
const main = remote.require('./main.js')
const { ipcRenderer } = require('electron')

os = require('os')

ipcRenderer.on('updateTime', (event, message) => {
    vue.secsRemaining=message;
    vue.secsElapsed=remote.getGlobal('shared').secsElapsed;
})

var vue = new Vue({
    el: '#app',
    data: {
        session: remote.getGlobal('session'),
    },
    computed: {
        timeRemaining: function() {
            var h = Math.floor(this.secsRemaining / 3600);
            var m = Math.floor(this.secsRemaining % 3600 / 60);
            var s = Math.floor(this.secsRemaining % 3600 % 60);

            var hh = h > 0 ? h + "h " : "";
            return hh + m + "m " + s + "s";
        },
        timeElapsed: function() {
            var h = Math.floor(this.secsElapsed / 3600);
            var m = Math.floor(this.secsElapsed % 3600 / 60);
            var s = Math.floor(this.secsElapsed % 3600 % 60);

            var hh = h > 0 ? h + "h " : "";
            return hh + m + "m " + s + "s";
        }
    }

})
