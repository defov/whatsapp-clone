import React, { useState, useEffect } from 'react';
import Loading from './components/Loading'
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import axios from './app/axios'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser, selectCurrentUser } from './slices/userSlice';
import './App.css';

function App() {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/users/me').then(response => {
      if(response.status == 200) {
        dispatch(setCurrentUser({
          id: response.data.id,
          username: response.data.username
        }))
      }
    }).catch(error => {
      console.log(error)
    }).finally(() => setLoading(false))
  }, [])

  if(loading) return <Loading />

  return (
    <div className="app">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;

const AuthProvider = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation()
  
  if(location.pathname == '/login' || location.pathname === '/signup') {
    if(user) return <Navigate to="/" state={{ from: location }} replace />
  } else {
    if(!user) return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (<>{children}</>)
}