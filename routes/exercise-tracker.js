const express = require('express');
const router = express.Router();
const User = require('../models/exercise')

const generateUserId = () => {
    return 'xxxxxxxxx'.replace(/x/g, () => {
        return (Math.random() * 36 | 0).toString(36)
    })
}

const errorJson = {
    error: "There was an error"
}

router.get('/exercise', function(req, res){
    res.render('exercise')
})
router.post('/api/exercise/new-user', function (req, res) {
    let uName = req.body.username;
    if (uName.length > 31) {
        return res.send('Username too long');
    }
    User.findOne({ "username": uName }, function (err, data) {
        if (err) {
            return res.json(errorJson);
        } else {
            if (data) {
                return res.send("Username already taken")
            } else if (!data) {
                User.create({ id: generateUserId(), username: uName, log: [] }, (err, data) => {
                    if (err) {
                        res.json(errorJson)
                    } else {
                        res.json({
                            "id": data.id,
                            "username": data.username,
                        })
                    }
                })
            }
        }
    })
})
router.get('/api/exercise/users', function (req, res) {
    User.find({}).select("-_id -log").exec((err, data) => {
        if (err) {
            res.json(errorJson)
        } else {
            res.json(data)
        }
    })
})
router.post('/api/exercise/add', function (req, res) {
    let newLog = req.body.exercise;
    if (!newLog.date) {
        newLog.date = new Date(Date.now()).toString().substr(0, 15);
    } else {
        newLog.date = new Date(newLog.date).toString().substr(0, 15)
    };
    User.findOne({ id: req.body.userId }, (err, user) => {
        if (err) {
            return res.json(errorJson)
        } else {
            user.log.push(newLog);
            user.save((err, data) => {
                if (err) {
                    res.json(errorJson)
                } else {
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

                    res.json({
                        "username": data.username,
                        "id": data.id,
                        "log": changedLog
                    })
                }
            });

        }
    })
})
router.get('/api/exercise/log', function (req, res) {
    let fromDate = req.query.from;
    let toDate = req.query.to;
    let limit = req.query.limit;
    if (!req.query.userId) {
        res.send("User not specified")
    } else {
        User.findOne({ id: req.query.userId }, (err, data) => {
            if (err) {
                res.json({
                    "error": "There was an error"
                })
            } else {
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
                    //routerly limit
                }(data, fromDate, toDate, limit)

                res.json({
                    "username": data.username,
                    "id": data.id,
                    "count": changedLog.length,
                    "log": changedLog
                })
            }
        })
    }
})

module.exports = router;