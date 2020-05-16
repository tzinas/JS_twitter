import React, { useState, useEffect } from 'react'
import Base from './Base'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'
const axios = require('axios');
const qs = require('qs')


const TITLE = 'Post-it | Log in'

function Login() {
  const [user, setUser] = useState()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:4000/api/account/verify_credentials')
    .then((result) => {
      setUser(result.data.user)
      setLoading(false)
    }).catch((error) => {
      setLoading(false)
    })
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    axios.post('http://localhost:4000/api/account/login', qs.stringify({ username, password }),
    { headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
    .then(res => {
      console.log(res)
      console.log(res.data)
      if (res.data) {
        setRedirect(true)
      }
      else {
        setUsername('')
        setPassword('')
      }
    }).catch(function (error) {
      console.log(error);
    })
  }

  const LogIn = () => {
    if (user || redirect) {
      return <Redirect to='/home' />
    }
    else {
      return <div></div>
    }
  }
  console.log('hey')
  if(!loading) {
    return (
      <div id="makepost">
        <Helmet>
          <title>{ TITLE }</title>
        </Helmet>
        <Base url="/login" user={user} />
        {LogIn()}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type='text' className="form-control"
              name="username" value={username}
              onChange={(e) => { setUsername(e.target.value) }
              }/>

          </div>
          <div className="form-group">
            <label htmlFor='password'>Password:</label>
            <input id="pw" type='password' className="form-control"
              name="password" value={password}
              onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <button type='submit' className="btn btn-primary"> Log In </button>
        </form>
        <div id="or_register_login"> or <a href="/register"> Register</a></div>
      </div>

    )
  }
  else {
    return <div>hey</div>
  }
}

export default Login
