const mongoose = require('mongoose');

const calendarSchema  = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'pending'
    },
    attendees: [{
        type: String,
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

calendarSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

calendarSchema.set('toJSON', {
    virtuals: true,
});

exports.Calendar  = mongoose.model('Calendar', calendarSchema);
