const express = require('express');
const router = express.Router();
const URL = require('../models/url');
const dns = require('dns');
const isURL = require('is-url');


router.get('/shorturl', function (req, res) {
    return res.render('url')
})

router.post('/api/shorturl', function (req, res) {
    if (!isURL(req.body.url)) {
        return res.status(400).send({
            "error": "Not a valid URL"
        })
    }
    URL.findOne({ original: req.body.url }).exec()
        .then((data) => {
            if (!data) {
                return URL.findOne({}).sort("-shortened").exec()
            } else if (data) {
                return res.send({
                    original: data.original,
                    shortened: data.shortened
                })
            }
        })
        .then((num) => {
            if (!num) {
                throw new Error('No urls found')
            } else {
                let newNum = Number(num.shortened) + 1;
                if (isNaN(newNum)) {
                    throw new Error('Database error')
                } else {
                    return URL.create({ "shortened": newNum, "original": req.body.url })
                }
            }
        })
        .then((newURL) => {
            if (!newURL) {
                throw new Error('Database Error')
            } else {
                return res.status(200).send({
                    original: newURL.original,
                    shortened: newURL.shortened
                })
            }
        })
        .catch((error) => {
            return res.status(400).send(error)
        })

})
router.get('/api/shorturl/:num', function (req, res) {
    if (isNaN(Number(req.params.num))) {
        return res.status(400).send('shortURL mus be a number')
    }
    URL.findOne({ shortened: req.params.num }).exec()
        .then((data) => {
            if (!data) {
                throw new Error("No URL found for the given input")
            }
            return res.status(302).redirect(data.original)
        })
        .catch((error) => {
            res.status(404).send(error)
        })
})

module.exports = router;