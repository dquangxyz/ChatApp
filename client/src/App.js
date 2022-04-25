import React, {useState} from "react"
import "./App.css"
import io from "socket.io-client"
import Chat from "./Chat.js"

//Connect front-end to back-end
// (react front-end is running on port 3000, back-end is running on port 3001)
const socket = io.connect("http://localhost:3001")


function App() {
  const [userName, setUserName] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat]=useState(false)

  function joinRoom(){
    if (userName !== "" && room !== ""){
      socket.emit("join_room", room) //pass event "join_room" to back-end, and pass the argument(s)
      setShowChat(true)
    }
  }

  return (
    <div className="App">

      {!showChat ? ( 
        <div className="joinChatContainer">
          <h3>Join a chat</h3>

          <input 
            type="text" 
            placeholder="Person name..." 
            onChange={event => setUserName(event.target.value)}  
          />

          <input 
            type="text" 
            placeholder="Room ID..." 
            onChange={event => setRoom(event.target.value)}    
          />

          <button onClick={joinRoom}>Enter the room</button>
        </div>
      ):(
        <Chat 
          socket={socket}
          userName={userName}
          room={room}
      />
      )
      }

    </div>
  );
}

export default App;
