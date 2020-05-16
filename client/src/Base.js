import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
const axios = require('axios');

function Base (params) {
  const [loggedIn, setLoggedIn] = useState(true)
  const handleLogOut = (event) => {
    event.preventDefault()

    axios.get('http://localhost:4000/api/account/logout')
    .then((result) => {
      setLoggedIn(false)
    })
  }
  if(loggedIn){
    return (
      <div>
        <div id="start" className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
            <a className="navbar-brand" href="/home">PostIt</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navbarSupportedContent" className="collapse navbar-collapse">
              {params.user &&
                <ul className="navbar-nav">
                    {params.url === "/"
                    ? <li className="nav-item active">
                        <a className="nav-link" href="/home">Home</a>
                      </li>
                    : <li className="nav-item">
                        <a className="nav-link" href="/home">Home</a>
                      </li>
                    }
                    {(params.url === '/user' && params.user.username === params.profileUser.username) ?
                      <li className="nav-item active">
                        <a className="nav-link" href={"/user/" + params.user.username}>Profile</a>
                      </li>
                      :
                      <li className="nav-item">
                        <a className="nav-link" href={"/user/" + params.user.username}>Profile</a>
                      </li>
                    }
                </ul>
              }
            </div>
            {params.user &&
              <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <a id="logoutLink" className="nav-link" onClick={handleLogOut}>Log Out</a>
                  </li>
                </ul>
              </div>
            }
          </nav>
        </div>
      </div>
    )
  }
  else {
    return <Redirect to='/login' />
  }
}

export default Base
