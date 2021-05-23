var express = require('express');
var app = require('../app');
var router = express.Router();
var User = require('../models/user');
var Roomp2p = require('../models/room');
var upicture = require('../models/proflastpic');
var Msgpair = require('../models/msgpair');
const room = require('../models/room');
// const { json } = require('body-parser');
//const umap = new Map();
//

// app.param('uid', function (req, res, next, id) {
//     console.log('CALLED ONLY ONCE');
//     next();
//   });
router.post('/roomp2p', isLoggedIn, function (req, res) {
    let data = req.body;
    let room = new Roomp2p();
    room.name = '';
    room.isGroup = false;
    room.usersId.push(data.me, data.to);
    room.save(function (err) {
        if (err)
            res.end(JSON.stringify({ r: null }));
        else {
            let rid = {
                r: room._id
            };
            res.end(JSON.stringify(rid));
        }
    });
});



router.get('/', isLoggedIn, function (req, res) {

    res.render('chatroom.html', { user: req.user.local });
});

router.get('/msgviewer/:uid', isLoggedIn, function (req, res) {
    User.findById(req.params.uid).populate('ppic').exec((err, users) => {
        if (!err) {
            Roomp2p.findOne({
                $or: [{ $and: [{ 'usersId.0': req.user._id }, { 'usersId.1': req.params.uid }] },
                { $and: [{ 'usersId.1': req.user._id }, { 'usersId.0': req.params.uid }] }]
            }).exec((ex, rum) => {
                if (!ex) {
                    res.render('msgviewer.html', { user: users, rid: rum._id });
                }
            });
        }
    });
});
//

// let newmsg = {
//     crtime: Date.now(),
//     msgtext: message,
//     picpath: '../imgdata/profimg/prof.png',
//     ismy: false
// };

router.get('/lastfort/:rid', isLoggedIn, function (req, res) {
    Msgpair.find({ 'roomid': req.params.rid }).sort({ addDate: -1 }).limit(20).exec((err, ms) => {
        let msarr = [];
        for (let mss in ms) {
            msarr.push({
                crtime: ms[mss].mtime,
                msgtext: ms[mss].umsg,
                ismy: req.user._id.toString() === ms[mss].who._id.toString()
            });
        }
        res.end(JSON.stringify(msarr));
    });
});


//
router.get('/welcomechat', isLoggedIn, function (req, res) {

    res.render('welcomechat.html');
});
//
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}
//
module.exports = router;