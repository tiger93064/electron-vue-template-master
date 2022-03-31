import {app, BrowserWindow, ipcMain} from 'electron';
import {join} from 'path';
var express = require('express');
var expressApp = express();
var cors = require('cors')

var Crawler = require("crawler");
var fs = require('fs');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }



   ipcMain.on('getPrinterList', async (event) => {
    //Get printer list in main thread
    const list = await mainWindow.webContents.getPrintersAsync();
    //Send events to the rendering thread through webContents, and pass the printer list
    mainWindow.webContents.send('getPrinterList', list);
  });


  const port = 78

  var cors = require('cors');
  const corsOptions = {
    origin: [
      'http://146.71.77.32:8092',
      'http://194.37.80.181:8092/',
      'http://localhost:78',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization','X-Parse-Application-Id'],
  };
  // expressApp.use(cors(corsOptions))

  expressApp.use(express.json());
  expressApp.use(express.urlencoded());

  expressApp.get('/', (req, res) => { 

    res.send('success sending GET request'); 
  })

  expressApp.options('/', (req, res) => { 
    console.log("success sending OPTIONS request")
    res.send('success sending OPTIONS request'); 
  })
  expressApp.post('/', (req, res) => {
    mainWindow.webContents.send('doPrint', req.body);
    res.send('POST request to the homepage');
  })

  expressApp.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  var c = new Crawler({ maxConnections : 10 });
  expressApp.get('/imageCrawler/:cmmdName', (req, res) => { 
    // console.log("crawling: "+req.params.cmmdName)
    mainWindow.webContents.send('consoleInVue', new Date().toLocaleString()+" crawling: "+req.params.cmmdName);
    c.queue([{
      uri: 'https://www.google.com.tw/search?q='+encodeURIComponent(req.params.cmmdName)+'&tbm=isch',
  
      // The global callback won't be called
      callback : function (error, res1, done) {
        if(error){
            console.log(error);
        }
        else{
            var $ = res1.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server 
            // console.log($('img')[1].attribs.src);
            let crawResult = $('img')
            if(crawResult.length > 1)  res.redirect($('img')[1].attribs.src)
            else res.status(404).send("Sorry can't find that!")
           

          
        }
        done();
      }
  }]);



    
  })



}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
    
  });


});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

