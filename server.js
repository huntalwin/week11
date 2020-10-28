let express = require('express');
let app = express();
let path = require('path');
let server = require('http').Server(app)
let io = require('socket.io')(server);
let port = 8080

app.use('/',express.static(path.join(__dirname,'dist/week11lab'))); //Every time user make a request to / path, express will use __dirname/dist/week11lab folder as a base folder (builed version of your front-end (ANG))

let pollObj = {
    question: "Select your favorite component",
    options:[
        {text:"Angular",value:0,count:0},
        {text:"MongoDB",value:1,count:0},
        {text:"Express.js",value:2,count:0},
        {text:"Golang",value:3,count:0},
        {text:"Python",value:4,count:0},
        {text:"C#",value:5,count:0},
        {text:"PhP",value:6,count:0},
        {text:"C++",value:7,count:0},
    ]
}

/**
 * Handle new connect to client
 *  socket in second param is the socket to client
 */
io.on("connection",socket =>{
    //Debugging only
    console.log('New connection from ' + socket.id);

    //broadcast pollObj to every client when new client connected to the server
    io.sockets.emit('newpoll',pollObj); //Emit newpoll event (BC pollObj to all client)

    //Listen on votesubmit event (emitted from client) and update the poll then boardcast the new poll to every client
    socket.on('votesubmit',data=>{
        console.log('New vote from client: ' + socket.id + ' Seleted option: ' + data);
        calculatePoll(data);
        io.sockets.emit('newpoll',pollObj); //Emit newpoll event (BC pollObj to all client)
    });
});


function calculatePoll(option){
    if(option >= 0)
    pollObj.options[option].count++; //Increemnt the selected option counter by 1
}

server.listen(port,()=>{
    console.log('Server is runnig at http://127.0.0.1:' + port);
});