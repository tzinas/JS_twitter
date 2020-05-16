import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Base from './Base'
import { Redirect } from 'react-router-dom'

const axios = require('axios');
const qs = require('qs')

const TITLE = 'Post-It | Register'

function FormField(params) {
  if(!params.error && !params.data) {
    return (
      <input type={params.type} className="form-control"
        placeholder={params.placeholder} name={params.name}
        value={params.value} onChange={(e) => {params.setField(e.target.value)}}
        autoFocus={true}/>
    )
  }
  else if(!params.error) {
    return (
      <input type={params.type} className="form-control is-valid"
        placeholder={params.placeholder} name={params.name}
        value={params.value} onChange={(e) => {params.setField(e.target.value)}}/>
    )
  }
  else {
    return (
      <div>
        <input type={params.type} className="form-control is-invalid"
          placeholder={params.placeholder} value={params.value}
          name={params.name} onChange={(e) => {params.setField(e.target.value)}}/>
        <div className="invalid-feedback"> {params.error.msg}</div>
      </div>
    )
  }
}


function Register() {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState()
  const [data, setData] = useState()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [login, setLogin] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:4000/api/account/verify_credentials')
    .then((result) => {
      setUser(result.data.user)
    }).catch((error) => {
      setErrors({})
      setData({})
      setLoading(false)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    axios.post('http://localhost:4000/api/account/create', qs.stringify({username, email, password, repeatPassword }),
    { headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
    .then((result) => {
      setLogin(true)
    }).catch((error) => {
      if(error.response) {
        setErrors(error.response.data.errors)
        setData(error.response.data.data)
      }
    })
  }
  console.log(username, email, password, repeatPassword, errors, data)

  if(!loading) {
    if(login) {
      return <Redirect to='/home' />
    }
    else {
      return (
        <div id="makepost">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor='username'>Username:</label>
              <FormField key="username" name="username" type="text" placeholder="Username"
                error={errors.username} data={data.username} setField={setUsername} value={username} />
            </div>
            <div className="form-group">
              <label htmlFor='email'>Email:</label>
              <FormField key="email" name="email" type="text" placeholder="Email"
                error={errors.email} data={data.email} setField={setEmail} value={email}/>
            </div>
            <div className="form-group">
              <label htmlFor='password'>Password:</label>
              <FormField key="password" name="password" type="password" placeholder="Password"
                error={errors.password} data={data.password} setField={setPassword} value={password}/>
            </div>
            <div className="form-group">
              <label htmlFor='repeatPassword'>Repeat Password:</label>
              <FormField key="repeatPassword" name="repeatPassword" type="password" placeholder="Repeat Password"
                error={errors.repeatPassword} data={data.repeatPassword}
                setField={setRepeatPassword} value={repeatPassword}/>
            </div>
          <button type='submit' className="btn btn-primary"> Register </button>
          </form>
          <div id="or_register_login"> or <a href='/login'> Log in </a></div>
        </div>
      )
    }
  }
  else {
    return <div>hey</div>
  }
}

export default Register
