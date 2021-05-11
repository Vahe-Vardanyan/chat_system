var express = require('express');
var fs = require('fs');
var User = require('../models/user');
var multer = require('multer');
var upicture = require('../models/proflastpic');
var room = require('../models/room');
const { json } = require('body-parser');
const { Error } = require('mongoose');
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
router.get('/chatroom', isLoggedIn, async function (req, res) {
    var frndList = [];
    var frndObject = null;
    let _pp = '';
    let cids = [];
    try {
        var x = await room.find({ usersId: { $in: [req.user._id] } }).exec();
        //
        for (let element in x) {
            if (x[element].usersId[0].toString() == req.user._id) {
                cids.push([x[element].usersId[1], x[element]._id]);
            } else {
                cids.push([x[element].usersId[0], x[element]._id]);
            }
        }
        //
        for (let cid in cids) {
            var z = await User.findById(cids[cid]).populate('ppic').exec();
            if (z != null) {
                frndObject = null;
                frndObject = {
                    name: z.local.name,
                    fname: z.local.lastname,
                    frndid: z._id,
                    roomid: cids[cid][1],
                    pic: z.ppic == null ? z.ppic : z.ppic.picPath
                };
                frndList.push(frndObject);
            }
        }
        //
        var y = await upicture.findOne({ usId: req.user._id }).sort({ addDate: -1 }).limit(1).exec();
        if (y != null) {
            _pp = req.user._id + '/' + y.picPath;
        } else {
            _pp = '../imgdata/profimg/prof.png';
        }
        //
        res.render('chatroom.html', { ulist: frndList, me: req.user, pic: _pp });
        //
    } catch (ex) {
        res.end(ex.message);
    }
});

router.get("/usrfind/:fkey", isLoggedIn, function (req, res) {
    let abc = req.params.fkey;
    var reg = new RegExp(abc, 'i');
    User.find({ 'local.name': reg }).populate('ppic').exec(function (err, result) {
        try {
            if (err) {
                throw new Error(err);
            } else {
                let _fus = [];
                console.log(result);
                if (result.length == 0) {
                    res.end(JSON.stringify([]));
                }
                result.forEach((v, i, a) => {
                    _fus.push({
                        name: v.local.name,
                        lname: v.local.lastname,
                        prp: v.ppic == null ? '../imgdata/profimg/prof.png' : "../imgdata/" + v._id + "/" + v.ppic.picPath,
                        id: v._id
                    });
                });
                res.end(JSON.stringify(_fus));
            }
        } catch (ex) {
            res.end(ex.message);
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