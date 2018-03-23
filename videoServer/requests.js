import {Router} from 'express';
import {process} from "./ffmpegProcessing";

let fs = require('fs');
let fse = require('fs-extra');
let HLSServer = require('hls-server');
import {createServer} from 'http';
import {ports} from "./server";
import {sequelize, Video, User} from "./models";

let querystring = require('querystring');

export let router = Router();

router.post('/upload', async(req, res) => {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.fileToUpload;

    let metadata = file.name.match(/(.+)(\.)(\w+)/);

    //console.log(metadata)

    let newVideo = await Video.create({
        name: metadata[1],
        userId: parseInt(req.query.user),
        status: "processing",
        port: undefined,

    });

    res.redirect('http://localhost:3000/video?upload=ok');

    file.mv('videos/' + file.name, async(err) => {
        if (err) {
            console.log(err);
            return;
        }

        let processOk = await process(metadata[1], metadata[3], newVideo.id);

        if (processOk) {
            Video.findOne({
                where: {
                    id: {
                        $eq: newVideo.id,
                    },
                },
            }).then(video => {
                video.status = "ready";

                video.save();

                fs.unlink('videos/' + file.name);
            });
        }




    });
});
router.get('/play', async(req, res) => {

    let path = 'streams/' + req.query.id;

    let video = await Video.findOne({where: {id: req.query.id}});

    if (video.port) {
        console.log(video.name + " played on " + video.port);
        res.send(JSON.stringify({
            port: video.port,
        }));
        return;
    }

    let server = createServer();

    let streaming = 'streams/' + video.id + '/playlist.m3u8';
    console.log(streaming);

    new HLSServer(server, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming // Directory that input files are stored
    });

    for (var item in ports) {
        if (ports[item].available) {
            ports[item].available = false;
            server.listen(ports[item].port);
            console.log(video.name + " listening " + ports[item].port);

            video.port = ports[item].port;

            video.save();

            res.send(JSON.stringify({
                port: ports[item].port,
            }));

            return;
        }

    }

});

router.get('/delete', async(req, res) => {

    let id = parseInt(req.query.id);

    let video = await Video.findOne({
        where: {
            id: {
                $eq: id,
            },
        },
    });

    let destroyOk = await video.destroy();

    fse.remove('streams/' + video.id, err => {

        if (!err && destroyOk) {
            res.redirect('http://localhost:3000/video?delete=ok');
        }

    });

});
