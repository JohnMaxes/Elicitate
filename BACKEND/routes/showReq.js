var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.method, req.url);
});

module.exports = router;