var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var rumSchema = Schema({
    name: {
        type: String
    },
    isGroup:{
        type:Boolean
    },
    ctime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', rumSchema);