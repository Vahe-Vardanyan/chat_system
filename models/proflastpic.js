var mongoose = require('mongoose');

var picSchema = mongoose.Schema({
    usId: { type: mongoose.Types.ObjectId, ref: 'User' },
    picPath: { type: String },
    addDate: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('ProfPicure', picSchema);