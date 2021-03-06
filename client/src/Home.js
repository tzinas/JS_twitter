import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import Base from './Base'
import Post from './Post'
import api from './api'
import { Redirect } from 'react-router-dom'

const TITLE = 'Post-It'

function Home() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  const [post, setPost] = useState('')
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [posts, setPosts] = useState()

  useEffect(() => {
    async function fetchUser() {
      try {
        const result = await api.get('/account/verify_credentials')
        setUser(result.data.user)
        async function fetchPosts() {
          try {
            const postResult = await api.get('/posts/home')
            setPosts(postResult.data.posts)
            setLoading(false)
          } catch {
            setLoading(false)
          }
        }
        fetchPosts()
      } catch {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  function Success() {
    if (success) {
      return <div id="postup" className="alert alert-success" role="alert" > { success }</div>
    }
    else {
      return <div></div>
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const result = await api.post('/post/create', { post })
      setSuccess(result.data.success)
      setPosts(result.data.posts)
      setPost('')
    } catch (error) {
      if(error.response) {
        setSuccess('')
        setError(error.response.data.error.post.msg)
      }
    }
  }

  const handleChange = e => {
    setPost(e.target.value)
    setError('')
  }
  if(!loading) {
    if(!user) {
      return <Redirect to='/login' />
    }
    else{
      return (
        <div>
          <Base url="/" user={user} />
          <Success />
          <div id="start">
            <h1> Welcome, <a href={'/user/' + user.username}>{user.username}</a>!</h1>
            <form onSubmit={handleSubmit}>
              <div id="posttext" className="form-group">
                <label htmlFor='post'> Make a new post:</label>

                <textarea id="post" className={error ? "form-control is-invalid" : "form-control"} type='text'
                  placeholder='Type Here' name='post' rows="4" value={post}
                  onChange={(e) => { handleChange(e) }}></textarea>
                <div className="invalid-feedback">{error}</div>

              </div>
              <button type="submit" className="btn btn-primary">Post</button>
            </form>
          </div>
          <div id="homeFeed">
            <Post posts={posts} />
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

export default Home
