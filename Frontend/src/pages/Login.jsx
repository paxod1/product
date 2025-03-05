import React, { useState } from 'react'
import './login.css';
import { Link } from 'react-router-dom';
import { loginUser } from '../API/ApiCalling';
import  {useDispatch}from 'react-redux'


function Login() {
  const [email,setEmail]=useState()
  const [password,setPassword]=useState()
  const dispatch=useDispatch()


  function APIcallLogin(){
    loginUser({email,password},dispatch)
    window.location.reload()
  }
  
  return (
    <div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-logo">
          </div>

          <input
            className="login-input"
            type="text"
            placeholder="email"
            onChange={((e)=>setEmail(e.target.value))}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={((e)=>setPassword(e.target.value))}
          />
          <button className="login-button" onClick={APIcallLogin}>Log In</button>
          <div className="divider">
            <div className="line"></div>
            <div className="or">OR</div>
            <div className="line"></div>
          </div>
        </div>
        <div className="signup-box">
          <span>Don't have an account?</span>
          <Link to={'/signup'} >
            <a href="#">Sign up</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login