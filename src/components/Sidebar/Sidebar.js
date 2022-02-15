import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setCurrentUser, selectMessageReceiver, setMessageReceiver } from '../../slices/userSlice'  
import './Sidebar.css'
import SidebarChat from './SidebarChat/SidebarChat'
import { Avatar, IconButton } from '@material-ui/core'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchOutlined from '@material-ui/icons/SearchOutlined'

const Sidebar = ({ users, messages }) => {

    const [search, setSearch] = useState("");
    const currentUser = useSelector(selectCurrentUser)
    const messageReceiver = useSelector(selectMessageReceiver)

    const dispatch = useDispatch()
    
    const logout = async () => {
        localStorage.removeItem('token')
        dispatch(setMessageReceiver(null))
        dispatch(setCurrentUser(null))
    }

    return (
        <div className="sidebar">
            <div className="sidebar__header" onClick={logout}>
                <div className='sidebar__headerLeft'>
                    <Avatar className='sidebar__avatar' src={currentUser?.profileImage} />
                    <h3>{currentUser.username}</h3>
                </div>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input 
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder="Search or start new chat"
                    />
                </div>
            </div>

            <div className="sidebar__chats">
                <h2>Users</h2>
                {users && users.filter(user => user.username.startsWith(search)).map(user => {
                    
                    let lastMessage = "No messages yet."

                    if(Array.isArray(messages)) {
                        const message = messages.findLast((message) => (
                            message.sender === currentUser?.id && message.receiver === user.id
                        ) || (
                            message.sender === user.id && message.receiver === currentUser?.id
                        ))
                        if(message) {
                            lastMessage = message.message
                        }
                    }

                    return (
                        <SidebarChat
                            key={user.id}
                            user={user}
                            lastMessage={lastMessage}
                            active={messageReceiver && user.id === messageReceiver.id} 
                            onClick={() => dispatch(setMessageReceiver(user))}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar
