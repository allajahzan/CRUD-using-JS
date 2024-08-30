const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phoneNo: {
        type: String,
        require: true
    },
    profilePic: {
        type: String,
        require: true
    },
    type: {
        type: String,
        default: "user"
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;