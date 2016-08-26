#!/usr/bin/env node
/* global process */

var fs = require('fs')
var path = require('path')
var weaver = require('./code-weaver')

// console.log(process.argv)

if (process.argv.length == 4) {
  var inpath = process.argv[2]
  var outpath = process.argv[3]
} else {
  console.log('usage: ./%s in.json out.c', path.basename(process.argv[1]))
  process.exit(1)
}

var infile = fs.readFileSync(inpath, {encoding: 'utf8'})
injson = JSON.parse(infile)

console.log("Generating '" + injson.Make + "' project.")
// console.log(injson)

weaver.setProjectConfig(injson)
weaver.loadModules()
var result = weaver.weave()

// console.log(result)
// TODO handle completion and errors
fs.writeFile(outpath, result)
