import React from 'react'
import Home from './Home'
import UserProfile from './UserProfile'
import Login from './Login'
import Register from './Register'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './css/bootstrap.min.css'
import './css/styles.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Switch>
          <Redirect from='/' to ='/home' exact />
        </Switch>
        <Route exact path='/home' component={Home} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route path='/user/:userProfile' component={UserProfile} />
      </BrowserRouter>
    </div>
  )
}

export default App
