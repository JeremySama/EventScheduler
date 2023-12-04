const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'http://192.168.100.231:4000/public/uploads/8456e6cb-8855-43ef-9f6d-524c3ac76157.jpeg-1699964839155.jpeg'
    },
    role: {
        type: String,
        default: 'user'
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip :{
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }

});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;

// {   "name": "",
//     "email": "",
//     "passwordHash": "password",
//     "phone": "0999992123",
//     "isAdmin": true,
//     "street": "champaca st",
//     "apartment": "champaca apartment",
//     "zip": "1630",
//     "city": "Taguig city",
//     "country": "Philippines",
// }