import React, { useState, useEffect } from 'react'
import Base from './Base'
import Post from './Post'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { useParams} from "react-router";
import profilePicture from './images/profile.png'
const axios = require('axios');
const qs = require('qs')

const TITLE = 'Post-It'

function UserProfile() {
  let {userProfile} = useParams()
  const [profileUser, setProfileUser] = useState()
  const [user, setUser] = useState()
  const [posts, setPosts] = useState()
  const [socialStatus, setSocialStatus] = useState()
  const [error, setError] = useState()
  const [isMyProfile, setIsMyProfile] = useState()
  const [loading, setLoading] = useState(true)

  const getUrl = 'http://localhost:4000/api/user/' + userProfile
  console.log(getUrl);

  useEffect(() => {
    axios.get(getUrl)
    .then((result) => {
      console.log(result.data);
      setProfileUser(result.data.profileUser)
      setUser(result.data.user)
      setPosts(result.data.posts)
      setSocialStatus(result.data.socialStatus)
      setIsMyProfile(result.data.user.username === result.data.profileUser.username)
      setLoading(false)
    }).catch(function (error) {
      if(error.response) {
        setError(error.response.status)
      }
    })
  }, [])

  const handleUnfollow = event => {
    event.preventDefault()
    console.log(profileUser.username)

    axios.post('http://localhost:4000/api/following/destroy', qs.stringify({ profileUsername: profileUser.username }),
    { headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
    .then(result => {
      setSocialStatus({followers: (socialStatus.followers - 1),
        following: socialStatus.following,
        isFollowing: !socialStatus.isFollowing })
    })
  }

  const handleFollow = event => {
    event.preventDefault()
    console.log(profileUser.username)

    axios.post('http://localhost:4000/api/following/create', qs.stringify({ profileUsername: profileUser.username }),
    { headers: {'Content-Type': 'application/x-www-form-urlencoded'} })
    .then(result => {
      setSocialStatus({followers: (socialStatus.followers + 1), 
        following: socialStatus.following,
        isFollowing: !socialStatus.isFollowing })
    })
  }

  if(!loading) {
    return (
      <div>
        <Base url='/user' user={user} profileUser={profileUser}/>
        <div id="userprofile">
          <img id="userimage" src={profilePicture} height="200px" width="200px" />
          <h1 id="username"> {profileUser.username} </h1>
          <p id="bio"> Hello my friend </p>
          <div id="followers"> Followers: {socialStatus.followers}</div>
          <div id="following"> Following: {socialStatus.following}</div>
          <br />
          {!isMyProfile &&
            <div>
            {!socialStatus.isFollowing ?
              <button id="followButton" className="btn btn-primary" onClick={handleFollow} > Follow </button>
            :
              <button id="unfollowButton" className="btn btn-secondary" onClick={handleUnfollow}> Unfollow </button>
            }
            </div>
          }
        </div>
        <div id="posts">
          <Post posts={posts} />
        </div>
      </div>
    )
  }
  else if(error === 401){
    return (
      <Redirect to='/login' />
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

export default UserProfile
