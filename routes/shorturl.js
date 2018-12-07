const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const dns = require('dns');
const isURL = require('is-url');


router.get('/shorturl', function (req, res) {
    res.render('url')
})

router.post('/api/shorturl', function (req, res) {
    let Json = {};

    if(!isURL(req.body.url)){
        return res.json({
            "error": "Not a valid URL"
        })
    }
        
    URL.findOne({ "original": req.body.url }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (!data) {
                URL.findOne({}).sort("-shortened").exec((err, num) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let newNum = num.shortened + 1;
                        URL.create({ "shortened": newNum, "original": req.body.url }, (err, newURL) => {
                            if (err) {
                                console.log(err);
                            } else {
                                Json.original = req.body.url;
                                Json.shortened = newNum
                                return res.json(Json)
                            }
                        })
                    }
                })
            } else {
                Json.original = data.original;
                Json.shortened = data.shortened;
                return res.json(Json)
            }
        }
    })


})
router.get('/api/shorturl/:num', function (req, res) {

    if (isNaN(Number(req.params.num))) {
        return res.json({
            "error": "Wrong Format"
        })
    }
    URL.findOne({ "shortened": req.params.num }, (err, data) => {
        if (err) {
            res.send("There was an error.")
            console.log(err);
        } else {
            if (!data) {
                return res.json({
                    "error": "No short URL found for given input"
                })
            } else {
                res.redirect(data.original)
            }
        }
    })
})

module.exports = router;