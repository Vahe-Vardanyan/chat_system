var express = require('express');
var fs = require('fs');
var User = require('../models/user');
var multer = require('multer');
var upicture = require('../models/proflastpic');
var participant = require('../models/participant');
var router = express.Router();

var dir = './public/imgdata/';
var picName = '';

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        try {
            if (!fs.existsSync(dir + req.user._id)) {
                fs.mkdirSync(dir + req.user._id);
            }
        } catch (err) {
            console.error(err);
        }
        callback(null, dir + req.user._id);
    },
    filename: function (req, file, callback) {
        picName = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, picName);
    }
});
//
var upload = multer({ storage: Storage }).array("imgUploader", 1);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//
router.get('/chatroom', isLoggedIn, function (req, res, next) {
    participant.find({ userId: req.user._id }).exec((parterr, rids) => {
        if (parterr) {
            next(parterr);
        } else {
            let arr=[];
            participant.find({ userId: {$in:rids.roomp2p},userId:{ $ne: req.user._id } }).select({ userId: 1, _id: 0 }).exec((ferr, fids) => {
                if (ferr) {
                    next(ferr);
                } else {
                    User.find({ _id: {$in:fids.userId } }).populate('ppic').exec((err, users) => {
                        if (err) {
                            next(err);
                        } else {
                            let _pp = '';
                            upicture.findOne({ usId: req.user._id }).sort({ addDate: -1 }).limit(1).exec(function (err, data) {
                                if (data != null) {
                                    _pp = req.user._id + '/' + data.picPath;
                                } else {
                                    _pp = '../imgdata/profimg/prof.png';
                                }
                                res.render('chatroom.html', { ulist: users, me: req.user, pic: _pp });
                            });
                        }
                    });
                }
            });
        }
    });
});
//
router.post("/upload", isLoggedIn, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
            //return res.end("Something went wrong!");
        } else {
            var _ppic = new upicture();
            // _ppic._id = new mongoose.Types.ObjectId(),
            _ppic.usId = req.user._id;
            _ppic.picPath = picName;
            _ppic.addDate = Date.now();
            // save in to mongo db
            _ppic.save(function (err) {
                if (err)
                    throw err;
                else {
                    User.findByIdAndUpdate({ _id: req.user._id }, { ppic: _ppic.id }, { new: true, useFindAndModify: false }, (uerr, result) => {
                        if (uerr) {
                            throw uerr;
                        } else {
                            res.redirect('/profile');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}