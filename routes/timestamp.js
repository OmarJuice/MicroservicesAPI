const express = require('express');
const router = express.Router();

router.get('/timestamp', function(req, res){
    res.render('time')
})
router.get('/api/timestamp/:date_string?', function (req, res) {
    let requestDate;
    if (!req.params.date_string) {
        requestDate = Date.now();
    } else {
        requestDate = req.params.date_string;
    }
    let responseDate = new Date(requestDate);
    let unix = responseDate.getTime();
    let utc = responseDate.toUTCString()
    if (utc === "Invalid Date") {
        res.status(400).send({
            error: utc
        })
    } else {
        res.send({
            "unix": unix,
            "utc": utc
        })
    }
})

module.exports = router;