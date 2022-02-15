import React, { useEffect, useState } from 'react'
import axios from '../../app/axios'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../slices/userSlice'
import { Link } from 'react-router-dom'
import './Login.css'

const Login = () => {
  
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const login = async (e) => {
    e.preventDefault();
    setError(null)
    //TODO... is loading
    
    const response = await axios.post('/auth/login', {
      username,
      password
    })

    if(response.data?.error) {
      setError(response.data.error)
    } else if(response.status === 200) {
      setUsername('')
      setPassword('')
      localStorage.setItem('token', response.data.token)
      dispatch(setCurrentUser({
        id: response.data.id,
        username: response.data.username,
        profileImage: response.data.profileImage
      }))
    }
  }

  return (
      <div className='login'>
        <div className='login__container'>
          <img src="/images/WhatsAppLogo.svg" alt="" />
          <h1>Login</h1>
          {error && (
              <p className='login__error'>{ error }</p>
          )}
          <form className='login__form'>
            <div>
              <label>Username:</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button
                type='submit'
                onClick={login}
                disabled={!username || !password}
              >
                Login
              </button>
          </form>
          <Link to="/signup">You don't have an account?</Link>
        </div>


      </div>
  )
};

export default Login;
