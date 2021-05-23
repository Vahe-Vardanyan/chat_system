var WebSocket = require('ws');
const url = require('url');
var http = require('http');
var Msgs = require('./models/msgpair');
var User = require('./models/user');
var Room = require('./models/room');
var Particip = require('./models/room');

//
module.exports = function (app) {
    var wss = new WebSocket.Server({ port: 9030 });
    var server = http.createServer(app);
    const umap = new Map();
    //
    server.on('upgrade', (req, sok, head) => {
        wss.handleUpgrade(req, sok, head, (ws) => {
            wss.emit('connection', ws, req);
        });
    });
    //
    wss.on('connection', function (ws, req) {
        const usid = url.parse(req.url, true).query;
        //
        //Msgs.find({ $or: [{ 'meid': me }, { 'whoby': param }]}, function (err, docs) {
        //    console.log(docs);
        //});
        //
        umap.set(usid.me, ws);
        //
        ws.on('message', function (message) {
            try {
                var msg = JSON.parse(message);
                //
                var dbmsg = new Msgs();
                dbmsg.who = usid.me;
                dbmsg.roomid = msg.tid.rmid;
                dbmsg.umsg = msg.text;
                //
                dbmsg.save(function (err) {
                    if (err)
                        throw err;
                    else {
                        if (umap.get(msg.tid.usid) != null) {
                            console.log( msg.text);
                            console.log(umap.get(msg.tid.usid));

                            umap.get(msg.tid.usid).send(msg.text);
                        }
                    }
                });
            } catch (ex) {
                console.log(ex.message);
            }
        });
        //
        ws.on('close', function () {
            console.log('UID LOGOUT -> ' + usid.me);
            umap.delete(usid.me);          
        });
        //
        ws.on('error', function (err) {
            ws.send('Error from server');
            console.log('Error -> ' + err);
        });
    });
}
