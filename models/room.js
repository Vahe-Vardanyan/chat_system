var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var rumSchema = Schema({
    usersId: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGroup:{
        type:Boolean
    },
    ctime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', rumSchema);