var express = require('express');
var router = express.Router()

router.get('/', function (req, res) {
        res.json({"authorized": "Information Here"})
    })
  
  module.exports = router