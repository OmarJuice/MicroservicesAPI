const express = require('express');
const router = express.Router();

router.get('/whoami', function(req, res){
    res.render('parser')
})
router.get('/api/whoami', function(req, res){
   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({
        "ipaddress": ip,
        "language": req.acceptsLanguages(),
        "software": req.headers['user-agent']
    })
})

module.exports = router;