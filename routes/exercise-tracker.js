const express = require('express');
const router = express.Router();
const {Exerciseuser, generateUserId} = require('../models/exercise')


router.get('/exercise', function (req, res) {
    res.render('exercise')
})
router.post('/api/exercise/new-user', function (req, res) {
    let uName = req.body.username;
    if (uName.length > 31) {
        return res.status(400).send('Username too long');
    }
    Exerciseuser.findOne({ "username": uName }).exec()
        .then((data) => {
            if (data) {
                throw new Error('Username already Taken')
            } else if (!data) {
                return Exerciseuser.create({ id: generateUserId(), username: uName, log: [] })
            }
        })
        .then((newUser) => {
            return res.json({
                id: newUser.id,
                username: newUser.username
            })
        })
        .catch((error) => {
            return res.status(400).send({
                "error": error.message
            })
        })
})
router.get('/api/exercise/users', function (req, res) {
    Exerciseuser.find({}).select("-_id -log").exec()
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            res.status(404).send(error)
        })
})
router.post('/api/exercise/add', function (req, res) {
    let newLog = req.body.exercise;
    if (!newLog.date) {
        newLog.date = new Date(Date.now()).toString().substr(0, 15);
    } else {
        newLog.date = new Date(newLog.date).toString().substr(0, 15)
    };
    Exerciseuser.findOne({ id: req.body.userId }).exec()
        .then((user) => {
            if (!user) {
                throw new Error("User not found.")
            }
            user.log.push(newLog)
            return user.save()
        })
        .then((data) => {
            const changedLog = function (data) {
                let newLog = data.log.map((item) => {
                    let newItem = {};
                    newItem.description = item.description;
                    newItem.duration = item.duration
                    newItem.date = item.date;
                    return newItem
                })
                return newLog;
            }(data)

            return res.json({
                "username": data.username,
                "id": data.id,
                "log": changedLog
            })
        })
        .catch((error) => {
            res.json({
                "error": error.message
            })
        })
})
router.get('/api/exercise/log', function (req, res) {
    let fromDate = req.query.from;
    let toDate = req.query.to;
    let limit = req.query.limit;
    if (!req.query.userId) {
        return res.status(400).send({
            "error": "User not specified"
        })
    }

    Exerciseuser.findOne({ id: req.query.userId }).exec()
        .then((data) => {
            if (!data) {
                throw new Error("User not found")
            }
            {
                let changedLog = function (data, from, to, limit) {
                    let newLog = data.log.map((item) => {
                        let newItem = {};
                        newItem.description = item.description;
                        newItem.duration = item.duration;
                        newItem.date = item.date;
                        return newItem
                    })
                    newLog = newLog.sort((a, b) => {
                        let dateA = new Date(a.date);
                        let dateB = new Date(b.date);
                        if (dateA > dateB) {
                            return 1
                        }
                        if (dateB > dateA) {
                            return -1
                        }
                        return 0
                    });
                    newLog = newLog.filter((item) => {
                        let itemDate = new Date(item.date).getTime() - 18000000;
                        if (from && (new Date(from).getTime() > itemDate)) {
                            return false
                        }
                        if (to && (new Date(to).getTime() < itemDate)) {
                            return false
                        }
                        return true
                    })
                    if (!isNaN(Number(limit))) {
                        newLog = newLog.slice(0, limit)
                    }
                    return newLog
                }(data, fromDate, toDate, limit)

                res.json({
                    "username": data.username,
                    "id": data.id,
                    "count": changedLog.length,
                    "log": changedLog
                })
            }

        })
        .catch((err) => {
            res.status(404).send(err)
        })

})

module.exports = router;