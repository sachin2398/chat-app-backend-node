const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config/config");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorhandler } = require("./middileware/errorMiddileware");

const app = express();
app.use(cors({ origin: "*" })); 
app.use(express.json());
mongoose.connect(config.uri)
    .then(() => console.log("mongoDB connected".cyan.underline))
    .catch((err) => {
        console.log(`Error: ${err.message}`.red.bold);
        process.exit(1);
     }
    
);


app.get("/", (req, res) => {
    res.send("API is Running Successful");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use(notFound);
app.use(errorhandler);

const PORT = config.port;
const server=app.listen(PORT, () => {
    console.log(`port is running on local host ${PORT}`.yellow.bold)
});

const io= require("socket.io")(server,{
    pingTimeout:60000,
        cors:{
            origin:"*",
        }
    }
); 
io.on("connection",(socket)=>{
    console.log("Connected to socket.io");
socket.on("setup",(userData)=>{
    socket.join(userData._id);
    socket.emit("connected");
    console.log(userData.name,userData._id); 
});
socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("user joined Room:"+ room);
}); 

socket.on('typing',(room)=> socket.in(room).emit("typing"));
socket.on('stop typing',(room)=> socket.in(room).emit("stop typing"));

socket.on("new message",(newMessageRecieved)=>{
    var chat= newMessageRecieved.chat;
    if(!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(user => {
        if(user._id == newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
});

socket.off("setup" ,() =>{
    console.log("USER DISCONNEcted");
    socket.leave(userData._id);
});


});

  