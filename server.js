const express = require("express");
const path = require("path");
const { Socket } = require("socket.io");
var app = express();

var server = app.listen(3000,()=>{
    console.log("listening in 3000")
});

const io = require("socket.io")(server,{
    allowEIO3: true
});
app.use(express.static(path.join(__dirname,"")))
var userConnections =[]
io.on("connection",(Socket)=>{
    console.log("socked id is",Socket.id)
    Socket.on("userconnect",(data)=>{
        console.log("userconnnect",data.displayName,data.meetingid)
        var other_users = userConnections.filter(p=>p.meeting_id == data.meetingid)
        userConnections.push({
            connectionId:Socket.id,
            user_id:data.displayName,
            meeting_id:data.meetingid,
        });

        other_users.forEach((v)=>{
            Socket.to(v.connectionId).emit("inform_others_about_me",{
                other_user_id:data.displayName,
                connId:Socket.id
            })
        })
    })
})