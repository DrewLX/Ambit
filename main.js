const electron = require('electron')
const {app, BrowserWindow} = electron


app.on('ready', () => {
	let win = new BrowserWindow({width:1000, height:600})
	win.loadURL('file://' + __dirname + '/index.html')

	win.webContents.openDevTools()
})
