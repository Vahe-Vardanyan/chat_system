var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var partSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    roomp2p:{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    intime: {
        type: Date,
        default: Date.now
    },
    outime: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Participant', partSchema);