var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


var userSchema = Schema({
     ppic:{ 
        type:Schema.Types.ObjectId,
        ref:'ProfPicure'
     },
    local: {
        email: String,
        password: String,
        name: String,
        lastname: String,
        date: Date,
        isMale: Boolean
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        username: String,
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String,
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
    },
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);