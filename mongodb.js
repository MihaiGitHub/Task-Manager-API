/* File to support all operations for MongoDB */

const mongodb = require('mongodb')
// Gives access to the functions that manipulate the database
const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// By picking a db name then connecting, MongoDB will automatically create the db if not exists
// useNewUrlParser needed to pass connectionURL correctly
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    // Callback function once the connect operation is complete
    if(error){
        return console.log('Unable to connect to database!')
    }

    // Get the database connection
    const db = client.db(databaseName)

    // // insertOne is async and has a callback
    // db.collection('users').insertOne({
    //     name: 'Mike',
    //     age: 23
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }

    //     // ops is an array of all documents inserted
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 25
    //     }, {
    //         name: 'John',
    //         age: 24
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert documents!')
    //     }

    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Go to gym',
    //         completed: true
    //     }, {
    //         description: 'Finish class',
    //         completed: true
    //     }, {
    //         description: 'Eat meal',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert documents!')
    //     }

    //     console.log(result.ops)
    // })
    const ObjectID = mongodb.ObjectID
    // First argument is the search criteria, can be multiple fields
    db.collection('users').findOne({ _id: new ObjectID('5de2e58dfb30744d286c8063') }, (error, user) => {
        // Getting back a cursor which is a pointer to the data in the db
        if(error){
            return console.log('Unable to fetch')
        }

        console.log(user)

    })

    // .find returns a cursor which lets you specify how you want the data back
    // Use toArray to get back an array of documents
    db.collection('users').find({ age: 25 }).toArray((error, users) => {
        console.log(users)
    })

    db.collection('users').find({ age: 25 }).count((error, count) => {
        console.log(count)
    })

    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
        console.log(tasks)
    })

    // Update a users name; $set changes the fields value
    const updatePromise = db.collection('users').updateOne({
        _id: new ObjectID("5de2e58dfb30744d286c8063")
    }, {
        $set: {
            name: 'Andrew'
        }
    })

    updatePromise.then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // Update many tasks; $set changes the fields value
    db.collection('tasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result.modifiedCount)
    }).catch((error) => {
        console.log(error)
    })


})