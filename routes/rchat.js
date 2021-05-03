var express = require('express');
var app=require('../app');
var router = express.Router();
var User = require('../models/user');
var Roomp2p = require('../models/room');
var upicture = require('../models/proflastpic');
const room = require('../models/room');
// const { json } = require('body-parser');
//const umap = new Map();
//

// app.param('uid', function (req, res, next, id) {
//     console.log('CALLED ONLY ONCE');
//     next();
//   });
router.post('/roomp2p', isLoggedIn, function (req, res){
    let data=req.body;
    let room=new Roomp2p();
    room.name='';
    room.isGroup=false;
    room.usersId.push(data.me,data.to);
    room.save(function (err) {
        if (err)
        res.end(JSON.stringify({r:null}));
        else {
            let rid={
                r:room._id
            };
            res.end(JSON.stringify(rid));          
        }
    });
});



router.get('/', isLoggedIn, function (req, res) {
    
    res.render('chatroom.html', { user: req.user.local });
});

router.get('/msgviewer/:uid', isLoggedIn, function (req, res, next) {
    User.findById(req.params.uid).populate('ppic').exec( (err, users) => {
        if (err) {
            next(err);
        } else {           
            let _pp='';
             upicture.findOne({ usId: req.params.uid }).sort({ addDate: -1 }).limit(1).exec(function (err, data) {
                if (data) {
                    _pp='/imgdata/'+ req.params.uid + '/' + data.picPath;
                }else {
                    _pp= '/imgdata/profimg/prof.png';
                    }
             
                  res.render('msgviewer.html', { user: users, ppat:_pp });
            });   
        }
    });


    // console.log(req.params.uid);
});

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