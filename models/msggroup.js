var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var gmSchema = Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    who: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ctime: {
        type: Date,
        default: Date.now
    },
    gmsg: { type: String }
});

module.exports = mongoose.model('GroupMsg', gmSchema);