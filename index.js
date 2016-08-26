"use strict";
const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const childProcess = require('child_process')

const app = express()
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/schemacompile', function(req, res) {
// })

// allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/schemaflash', function(req, res) {
    let schema = req.body
    console.log("received scema")
  
    var weaver = require("../fractal-codegen/src/code-weaver")
    weaver.setProjectConfig(schema)
    var result = weaver.weave()
  
    fs.writeFileSync('fractal/fractal.ino', result, 'utf8')
	
	compileArduiono101()
  
  
    // fs.writeFileSync('schema.json', JSON.stringify(schema), 'utf8');
    // var codegenProc = childProcess.fork("../fractal-codegen/codegen",
    //  ["./schema.json", "../fractal-neuro-compiler/Elements/Neuro-Ethernet/code/main.c"]);
    // codegenProc.on('exit', function(code) {
    //  if (code !== 0) { console.log('Codegen failed: ' + code); }
    //  else { compileNeuro() }
        
    res.status(200).send("done");
    // })
})

function compileNeuro() {
    childProcess.execFile("../tools/neuro-compiler/compiler/Neuro-compiler/compiler-a.exe")
}

function compileArduiono101() {
    childProcess.execFile("C:/app/arduino-1.6.8/arduino", ["--upload", "--board", "Intel:arc32:arduino_101", "fractal/fractal.ino"], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
})

}



var port = 3001;
app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})
