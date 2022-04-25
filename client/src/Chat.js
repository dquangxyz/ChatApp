import React, { useEffect, useState } from "react"
import ScrollToBottom from "react-scroll-to-bottom"

function Chat({ socket, userName, room }) {
    const [sendingMessage, setSendingMessage] = useState("")
    const [messageList, setMessageList] = useState([])
    const [isClicked, setIsClicked] = useState(false)

    async function sendMessage() {
        if (sendingMessage !== "") {
            const messageData = {
                room: room,
                author: userName,
                message: sendingMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes()
            }
            await socket.emit("send_message", messageData)
            setMessageList((prevValue) => [...prevValue, messageData])
            setSendingMessage("")
        }
    }

    //useEffect only when [props.socket] changes
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((prevValue) => [...prevValue, data])
        })
    }, [socket])

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>🟢 {userName}</p>
            </div>

            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((eachMessage) => {
                        return (
                            <div
                                className="message"
                                id={userName === eachMessage.author ? "you" : "other"}
                            >
                                <div onClick={() => setIsClicked(!isClicked)}>
                                    <div className="message-content">
                                        <p>{eachMessage.message}</p>
                                    </div>

                                    {isClicked &&
                                    (
                                        <div className="message-meta">
                                            <p id="time">{eachMessage.time}</p>
                                        </div>
                                    )
                                    }

                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>

            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Hey..."
                    value={sendingMessage}
                    onChange={event => setSendingMessage(event.target.value)}
                    onKeyPress={event => { event.key === "Enter" && sendMessage() }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}


export default Chat