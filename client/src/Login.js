import React, { useState, useEffect } from 'react'
import Base from './Base'
import api from './api'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'


const TITLE = 'Post-it | Log in'

function Login() {
  const [user, setUser] = useState()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const result = await api.get('/account/verify_credentials')
        setUser(result.data.user)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    async function fetchLoginData() {
      try {
        const result = await api.post('/account/login', { username, password })
        setRedirect(true)
      } catch (error) {
        setUsername('')
        setPassword('')
      }
    }
    fetchLoginData()
  }

  const LogIn = () => {
    if (user || redirect) {
      return <Redirect to='/home' />
    }
    else {
      return <div></div>
    }
  }
  if(!loading) {
    return (
      <div id="start">
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
    return (
      <Helmet>
        <title>{ TITLE }</title>
      </Helmet>
    )
  }
}

export default Login
