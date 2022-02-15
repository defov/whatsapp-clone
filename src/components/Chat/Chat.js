import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectMessageReceiver, selectCurrentUser } from '../../slices/userSlice'
import { Avatar, IconButton } from '@material-ui/core'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import SendIcon from '@material-ui/icons/SendRounded'
import axios from '../../app/axios'
import './Chat.css'

import "emoji-mart/css/emoji-mart.css"
import { Picker } from 'emoji-mart'

const Chat = ({ messages }) => {

    const currentUser = useSelector(selectCurrentUser)
    const messageReceiver = useSelector(selectMessageReceiver)
    const [input, setInput] = useState('')
    const [showEmojis, setShowEmojis] = useState(false)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        setInput('')
        messagesEndRef.current?.scrollIntoView()
    }, [messageReceiver])

    const sendMessage = async (e) => {
        e.preventDefault()
        if(!input.trim()) return
        if(sending) return
        setSending(true)

        await axios.post('/messages/add', {
            message: input,
            timestamp: new Date().getTime(),
            receiver: messageReceiver.id
        })

        setInput('')
        setSending(false)   
    }

    const addEmoji = (e) => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach((el) => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)
        setInput(input + emoji)
    }

    if(!messageReceiver) {
        return (
            <div className='chat__noMessages'>
                <img 
                    src='/images/WhatsAppLogo.svg' 
                    alt="" 
                />
                <h2>Messaging Clone</h2>
                <h5>Click on user to start chatting!</h5>
            </div>
        )
    }

    
    const userMessages = !messages ? [] : messages.filter(message => (
        (
            message.receiver === messageReceiver.id &&
            message.sender === currentUser.id
        ) || (
            message.receiver === currentUser.id &&
            message.sender === messageReceiver.id
        ) 
    )) 

    return (
        <div className='chat'>
            <div className="chat__header">
                <Avatar src={ messageReceiver.profileImage } />

                <div className="chat__headerInfo">
                    <h3>{ messageReceiver.username }</h3>
                    {/* <p>last seend on date</p> */}
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {userMessages.length ? (
                    userMessages.map((message,index) => (
                        <p key={index} className={`chat__message ${message.sender === currentUser.id && "chat__currentUser"}`}>
                            <span className="chat__name">
                                {message.sender === currentUser.id ? currentUser.username : messageReceiver.username}
                            </span>
                            {message.message}
                            <span className="chat__timestamp">
                                {new Date(Number(message.timestamp)).toFormattedString()}
                            </span>
                        </p>
                    ))
                ) : (
                    <div className='chat__empty'>
                        <p onClick={() => setInput('Hello!')}>Be first to say Hello!</p>
                    </div>
                )}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="chat__footer">
                <IconButton onClick={() => setShowEmojis(!showEmojis)}>
                    <InsertEmoticonIcon />
                </IconButton>
                
                {showEmojis && (
                    <Picker 
                        onSelect={addEmoji}
                        style={{
                            position: 'absolute',
                            marginTop: -460,
                            marginLeft: -40,
                            maxWidth: '320px'
                        }}  
                    />
                )}

                <form>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message" 
                    />
                    <button 
                        onClick={sendMessage}
                        type="submit"
                    >
                        Send a message
                    </button>
                </form>
                <IconButton onClick={sendMessage}>
                    <SendIcon className='chat__footer__iconSend' />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat