#!/usr/bin/env node
"use strict";

// Check if we are in an electron environment
if (process.versions["electron"]) {
  // off to a separate electron boot environment
  require("./build/electron");
} else {
  const program = require('commander');
  program
    .version(require('./package.json').version)
    .option('-j, --json <json>', 'Specify JSON Boot File', require('path').join(__dirname, 'save/conf/default.json'))
    .parse(process.argv);

  console.clear();

  // Boot the server
  require("./src/server").serveIt(program.opts().json);
}
