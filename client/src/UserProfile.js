import React, { useState, useEffect } from 'react'
import Base from './Base'
import Post from './Post'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { useParams} from "react-router";
import profilePicture from './images/profile.png'
import api from './api'

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


  useEffect(() => {

    async function fetchUser() {
      try {
        const result = await api.get('/account/verify_credentials')
        setUser(result.data.user)
        async function fetchProfileUser() {
          try {
            const userResult = await api.get('/user', { userProfile })
            setProfileUser(userResult.data.profileUser)
            setPosts(userResult.data.posts)
            setSocialStatus(userResult.data.socialStatus)
            setIsMyProfile(result.data.user.username === userResult.data.profileUser.username)
            setLoading(false)
          } catch {
            setLoading(false)
          }
        }
        fetchProfileUser()
      } catch {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleUnfollow = async (event) => {
    event.preventDefault()
    try {
      api.post('/following/destroy', { profileUsername: profileUser.username })
      setSocialStatus({followers: (socialStatus.followers - 1),
        following: socialStatus.following,
        isFollowing: !socialStatus.isFollowing })
    } catch (error) {
      console.log('Unfollow did not work')
    }
}

  const handleFollow = event => {
    event.preventDefault()
    try {
      api.post('/following/create', { profileUsername: profileUser.username })
      setSocialStatus({followers: (socialStatus.followers + 1),
        following: socialStatus.following,
        isFollowing: !socialStatus.isFollowing })
    } catch (error) {
      console.log('Follow did not work')
    }
  }

  if(!loading) {
    if(!user) {
      return <Redirect to='/login' />
    }
    else{
      return (
        <div>
          <Base url='/user' user={user} profileUser={profileUser}/>
          <div id="userprofile">
            <img id="userimage" src={profilePicture} alt="Profile" height="200px" width="200px" />
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
  } else {
    return (
      <Helmet>
      <title>{ TITLE }</title>
      </Helmet>
    )
  }
  }

export default UserProfile
