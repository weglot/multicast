#!/usr/bin/env node
if (process.argv.length == 2) {                                             // run with no arguments, display help
  console.log('Multicast is a persistent solution to presenting content across multiple Chromecast devices.')
  console.log('')
  console.log('USAGE: multicast <command> (--flags)')
  console.log('')
  console.log('Commands:')
  console.log('                config   run this first to set up Multicast')
  console.log('                 start   start Multicast as a foreground process')
  console.log('')
  console.log('Flags:')
  console.log('          --serve-only   do not run the mDNS server (won\'t interrupt existing receivers)')
  console.log('')
  console.log('Split Server/Client over WAN:')
  console.log('          --controller   run this instance as a controller only (no receivers on LAN)')
  console.log('              --server   run this instance as an endpoint only')
  console.log('               --mixed   run this instance as a controller and scan for receivers on LAN')
} else {
  if (process.argv.find(arg => arg == 'config')) require('./app/config.js') // run configuration
  else require('./app/main.js')                                             // start application
}