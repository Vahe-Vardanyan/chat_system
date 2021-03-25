var mongoose = require('mongoose');
const Schema = mongoose.Schema;
//
var upmsgSchema = Schema({
    roomid: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    who: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    umsg: {
        type: String
    },
    mtime: {
        type: Date,
        default: Date.now
    }
});
//
module.exports = mongoose.model('MessagePair', upmsgSchema);
