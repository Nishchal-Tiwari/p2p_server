const express=require('express')
const app=express()
const {Server}=require('socket.io')
const http=require('http')
const cors=require('cors')


const httpserver=http.createServer(app).listen(8000,()=>{
    console.log('server start')
})
const io =  new Server(httpserver, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    // socket.broadcast.emit('random','random  connection')
    // socket.emit('random1','random  connection attained')
    console.log(socket.id)
    socket.on('join-room-public',(roomid)=>{
        try{
            socket.join(roomid)
            socket.emit('room-joined',{roomname:roomid})
        }
        catch(err){
            socket.emit('error-joining-room',err)
        }
    })
    socket.on('join-room-private',(roomid)=>{
        try{
            const roomExists = io.sockets.adapter.rooms.has(roomid);
            if(roomExists){
                socket.emit(roomid,socket.id)
            }
            else{
            socket.join(roomid)
            socket.emit('room-joined',{roomname:roomid})
            }
        }
        catch(err){
            socket.emit('error-joining-room',err)
        }
    })
    
    socket.on('leave-room',(roomid)=>{
        try{
            socket.join(roomid)
            socket.emit('room-leaved',{roomname:roomid})
        }
        catch(err){
            socket.emit('error-leaving-room',err)
        }
    })
    socket.on('message-to-room',(roomid,msg)=>{
        console.log(roomid)
        socket.to(roomid).emit('room-message',msg)

    })
})

app.use(express.static('public'))
app.use(cors({
    origin:'http://localhost:3000'
}))
// app.get('*', (req, res) => {
//     console.log(req)
//     res.sendFile(__dirname + '/public/');
// })
