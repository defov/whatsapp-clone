import React, { useEffect, useState } from 'react';
import Chat from '../../components/Chat/Chat';
import Sidebar from '../../components/Sidebar/Sidebar';
import Pusher from 'pusher-js';
import axios from '../../app/axios'
import './Home.css'
import { setCurrentUser } from '../../slices/userSlice';

const Home = () => {
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {

        axios.get('/users')
        .then(response => {
            setUsers(response.data)
        })

        axios.get('/messages')
        .then(response => {
            setMessages(response.data)
        })

    }, [])

    useEffect(() => {
        const pusher = new Pusher(process.env.PUSHER_ID, {
            cluster: 'eu'
        });

        var channel = pusher.subscribe('messages');
        channel.bind('inserted', (newMessage) => {
            setMessages([...messages, newMessage])
        });

        return () => {
            channel.unbind('inserted')
            channel.unsubscribe()
        }
    });
    
  return (
      <main className="home">
          <Sidebar messages={messages} users={users} />          
          <Chat messages={messages} />
      </main>
  )
}

export default Home
