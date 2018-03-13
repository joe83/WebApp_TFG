let express = require('express');
let bodyParser = require('body-parser');
import {router} from "./requests";
import {createServer} from 'http';

// Creating router for handling video requests
let app = express();
export let server = createServer(app);
let port = process.env.VIDEO_SERVER_PORT || '8000';

//Port
app.set('port', port);

//QueryURL
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Router listening
server.listen(port, function() {
    console.log('Video server listening for requests on: ' + port);
});

// Rendering routes
app.use('/', router);

/*
import {process} from './ffmpegProcessing';

process('lbl', 'MOV');
*/
