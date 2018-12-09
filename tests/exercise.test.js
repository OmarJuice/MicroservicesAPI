const expect = require('expect');
const request = require('supertest');
const { app } = require('../index')
const { Exerciseuser, generateUserId } = require('../models/exercise')
const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

const users = [{
    id: generateUserId(),
    username: 'Admin',
    log: []
}, {
    id: generateUserId(),
    username: 'Bob',
    log: []
}, {
    id: generateUserId(),
    username: 'OJ',
    log: [{
        "description": "Walking",
        "duration": 10,
        "date": "Fri Feb 02 2018"
    },
    {

        "description": "Walking",
        "duration": 10,
        "date": "Fri Feb 02 2018"
    },
    {
        "description": "running",
        "duration": 10,
        "date": "Sat Feb 03 2018"
    },
    {
        "description": "swimming",
        "duration": 20,
        "date": "Sun Feb 04 2018"
    },
    {
        "description": "flying",
        "duration": 60,
        "date": "Mon Feb 05 2018"
    },
    {
        "description": "lifting",
        "duration": 60,
        "date": "Tue Feb 06 2018"
    },
    {
        "description": "laughing",
        "duration": 10,
        "date": "Fri Nov 30 2018"
    }]
}]

beforeEach(() => {
    try {
        Exerciseuser.remove({}).exec()
            .then((res) => {

            })
            .catch((err) => {
                console.log('ERROR: ', err);
            })
    } catch (error) {

    }

    Exerciseuser.create(users).then((res) => {
    }).catch((error) => {
        console.log('ERROR: ', error);
    })
})

describe('GET /api/exercise/users', () => {
    it('Should return a list of all users', (done) => {
        request(app)
            .get('/api/exercise/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBe(users.length)
                expect(res.body[0].username).toBe(users[0].username)
            })
            .end(done)
    })
})
describe('POST /api/exercise/new-user', () => {
    it('Should create a new user and return their id', (done) => {
        request(app)
            .post('/api/exercise/new-user')
            .send({
                username: 'Dude'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('id')
                expect(res.body.username).toBe('Dude')
            })
            .end(done)
    })
    it('Should return 400 if user already exists', (done) => {
        request(app)
            .post('/api/exercise/new-user')
            .send({
                username: 'Bob'
            })
            .expect(400)
            .end(done)
    })
    it('Should return 400 if given username is too long', (done) => {
        request(app)
            .post('/api/exercise/new-user')
            .send({
                username: 'tytfuyghldhfjghkgjhfjgkhjkjhfjgkhlkjghjhkjgjghjcghgjjkhljjhgkjghkjghhjk'
            })
            .expect(400)
            .end(done)
    })
})
describe('GET /api/exercise/log/', () => {
    it('Should return 400 if user is not specified', (done) => {
        request(app)
            .get('/api/exercise/log')
            .expect(400)
            .end(done)
    })
    it('Should return 404 if user is not found', (done) => {
        request(app)
            .get('/api/exercise/log?userId=jhkj')
            .expect(404)
            .end(done)
    })
    it('Should return users log if exists', (done) => {
        request(app)
            .get(`/api/exercise/log?userId=${users[2].id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.log.length).toBe(users[2].log.length)
            })
            .end(done)
    })
    it('Should apply limit to the returned log if it exists', (done) => {
        request(app)
            .get(`/api/exercise/log?userId=${users[2].id}&limit=5`)
            .expect(200)
            .expect((res) => {
                expect(res.body.log.length).toBe(5)
            })
            .end(done)
    })

})