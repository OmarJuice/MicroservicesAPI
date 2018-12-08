const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const dns = require('dns');
const isURL = require('is-url');


router.get('/shorturl', function (req, res) {
    res.render('url')
})

router.post('/api/shorturl', function (req, res) {
    if(!isURL(req.body.url)){
        return res.json({
            "error": "Not a valid URL"
        })
    }
    URL.findOne({original: req.body.url}).exec()
        .then((data) => {
           if(!data){
              return URL.findOne({}).sort("-shortened").exec()
           }else{
               return res.json({
                   original: data.original,
                   shortened: data.shortened
               })
           }  
        })
        .then((num) => {
            let newNum = num.shortened + 1;
            return URL.create({"shortened": newNum, "original": req.body.url})
        })
        .then((newURL) => {
            return res.json({
                original: newURL.original,
                shortened: newURL.shortened
            })
        })
        .catch((error) => {
            res.json({
                "error": error.message
            })
        })

})
router.get('/api/shorturl/:num', function (req, res) {
    if (isNaN(Number(req.params.num))) {
        return res.json({
            "error": "Wrong Format"
        })
    }
    URL.findOne({shortened: req.params.num}).exec()
        .then((data) => {
            if(!data){
                throw new Error("No URL found for the given input")
            }
            return res.redirect(data.original)
        })
        .catch((error) => {
            res.json({
                "error": error.message
            })
        })
})

module.exports = router;