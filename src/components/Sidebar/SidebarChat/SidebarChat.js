import React from 'react'
import './SidebarChat.css'
import { Avatar } from '@material-ui/core'

const SidebarChat = ({ user, lastMessage, active, onClick }) => {
    return (
        <div 
            className={`sidebarChat ${active && 'active'}`}
            onClick={onClick}
        >
            <Avatar src={user.profileImage} />
            <div className="sidebarChat__info">
                <h2>{ user.username }</h2>
                <p>{ lastMessage }</p>
            </div>
        </div>
    )
}

export default SidebarChat
