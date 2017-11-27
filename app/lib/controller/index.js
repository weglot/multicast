'use strict'

const config = require('../config')
const dbConnect = require('../config/db')

const port = 3944

var takeover = null

dbConnect(config)