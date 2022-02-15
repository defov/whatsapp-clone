import React, { useState, useRef } from 'react'
import axios from '../../app/axios'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../slices/userSlice'
import { Link } from 'react-router-dom'
import './SignUp.css'

const SignUp = () => {
  
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const imageInput = useRef()


  const signup = async (e) => {
    e.preventDefault();
    if(loading) return
    setLoading(true)
    const hasErrors = await handleErrors();
    if(hasErrors) {
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('profileImage', '/images/default.png');
    if(file) {
      formData.append('file', file)
    }

    const response = await axios.post('/auth/signup', formData)

    setLoading(false)
    if(response.data?.error) {
      setError(response.data.error)
    } else if(response.status === 201) {
      setEmail('')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
      setSelectedImage(null)
      setFile(null)
      localStorage.setItem('token', response.data.token)
      dispatch(setCurrentUser({
        id: response.data.id,
        username: response.data.username,
        profileImage: response.data.profileImage
      }))
    }

  }

  const handleErrors = async () => {
    setError(null)  

    // Check for valid email
    if(!email.isValidEmail()) {
        setError('Email is not valid!')
        return true
    }

    // Check for username length
    if(username.length < 3) {
        setError('Username must be atleast 3 characters!')
        return true;
    }
    if(password.length < 3) {
        setError('Password must be atleast 3 characters!')
        return true;
    }

    // Check confirm password
    if(password !== confirmPassword) {
        setError('Password doesn\'t confirm!');
        return true
    }

    return false
  }

  const setImage = (e) => {
      e.preventDefault()
      const reader = new FileReader();
      setFile(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function (e) {
        setSelectedImage(reader.result)
      }
  }

  return (
      <div className='signup'>
        <div className='signup__container'>
          <h1>Sign Up</h1>
          <div className='signup__imageContainer'>
              <img 
                src={selectedImage ?? "/images/default.png"} 
                alt=""
                onClick={() => imageInput.current.click()} 
            />
          </div>

          {error && (
              <p className='signup__error'>{ error }</p>
          )}

          <form className='signup__form'>
            <input 
                type="file" 
                ref={imageInput} 
                hidden
                onChange={setImage} 
            />
            <div>
              <label>Email:</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
              />
            </div>
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
            <div>
              <label>Confirm Password:</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
            <button
                type='submit'
                onClick={signup}
                disabled={!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()}
              >
                Sign Up
              </button>
          </form>
          <Link to="/login">You already have an account?</Link>
        </div>
      </div>
  )
};

export default SignUp;
