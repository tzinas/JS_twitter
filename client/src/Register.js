import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Base from './Base'
import { Redirect } from 'react-router-dom'

import api from './api'

const TITLE = 'Post-It | Register'

function FormField(params) {
  if(!params.error && !params.data) {
    return (
      <input type={ params.type } className="form-control"
        placeholder={ params.placeholder } name={ params.name }
        value={ params.value } onChange={ (e) => { params.setField(e.target.value) } }
        autoFocus={true}/>
    )
  }
  else if(!params.error) {
    return (
      <input type={ params.type } className="form-control is-valid"
        placeholder={ params.placeholder } name={ params.name }
        value={ params.value } onChange={ (e) => { params.setField(e.target.value) } }/>
    )
  }
  else {
    return (
      <div>
        <input type={ params.type } className="form-control is-invalid"
          placeholder={ params.placeholder } value={ params.value }
          name={ params.name } onChange={ (e) => { params.setField(e.target.value) } }/>
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
    async function fetchUser() {
      try {
        const rasult = await api.get('/account/verify_credentials')
      } catch (error) {
        setErrors({})
        setData({})
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const result = await api.post('/account/create', { username, email, password, repeatPassword })
      setLogin(true)
    } catch (error) {
      if(error.response) {
        setErrors(error.response.data.errors)
        setData(error.response.data.data)
      }
    }
  }

  if(!loading) {
    if(login) {
      return <Redirect to='/home' />
    }
    else {
      return (
        <div>
          <Base url='/register' user={user} />
          <div id="start">
            <form onSubmit={ handleSubmit }>
              <div className="form-group">
                <label htmlFor='username'>Username:</label>
                <FormField name="username" type="text" placeholder="Username"
                  error={ errors.username } data={ data.username } setField={ setUsername } value={username} />
              </div>
              <div className="form-group">
                <label htmlFor='email'>Email:</label>
                <FormField name="email" type="text" placeholder="Email"
                  error={ errors.email } data={ data.email } setField={ setEmail } value={email}/>
              </div>
              <div className="form-group">
                <label htmlFor='password'>Password:</label>
                <FormField name="password" type="password"
                  placeholder="Password" error={ errors.password }
                  data={ data.password } setField={ setPassword } value={ password }/>
              </div>
              <div className="form-group">
                <label htmlFor='repeatPassword'>Repeat Password:</label>
                <FormField name="repeatPassword" type="password"
                  placeholder="Repeat Password" error={ errors.repeatPassword }
                  data={ data.repeatPassword } setField={ setRepeatPassword }
                  value={ repeatPassword }/>
              </div>
            <button type='submit' className="btn btn-primary"> Register </button>
            </form>
            <div id="or_register_login"> or <a href='/login'> Log in </a></div>
          </div>
        </div>
      )
    }
  }
  else {
    return (
      <Helmet>
        <title>{ TITLE }</title>
      </Helmet>
    )
  }
}

export default Register
