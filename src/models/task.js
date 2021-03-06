const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference the User model to fetch entire user profile
    }
}, {
    timestamps: true
})

// Create task model; Once the second object argument is passed in, mongoose converts it into a schema
const Task = mongoose.model('Task', taskSchema)

module.exports = Task