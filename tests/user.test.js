const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

/* Load app for testing purpose */
const app = require('../src/app')

/* Load in User model for testing */
const User = require('../src/models/user')

/* Create a test user */
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'fedor@yahoo.com',
    password: 'Hdhss87$#',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

/* Function to run before each test case in this test suite */
beforeEach(async () => {
    /* Delete all users before running each test case */
    await  User.deleteMany()

    /* Save test user to database after deleteMany to test other endpoints */
    await new User(userOne).save()
})

/* Function to run after each test case in this test suite */
afterEach(() => {
    console.log('after each')
})

test('Should signup a new user', async () => {
    // Send data object to user signup endpoint and store response in variable
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Fedor',
            email: 'fedor@gmail.com',
            password: 'Pds56h789'
        })
        .expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Fedor',
            email: 'fedor@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Pds56h789')
})

test('Should login existing user', async () => {
    // Send data object to user login endpoint
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
})

test('Should not login nonexistent user', async () => {
    // Send data object to user login endpoint
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: 'Anotherpass564'
        })
        .expect(400)
})

test('Should get profile for user', async () => {
    // Set Authorization header with the token created above
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthorized user', async () => {
    // Set request without auth token
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})