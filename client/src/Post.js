import React from 'react'
import profilePicture from './images/profile.png'
const moment = require('moment')

function Post(params) {
  return (
    <div>
      {params.posts.map((post) => (
      <div key={post.id} className="card border-dark mb-3" style={ { maxWidth: "45rem"} }>
        <div className="card-header">
          <img id="postuserimage" src={ profilePicture } alt="Profile" height="30px" width="30px" />
          <a href={'/user/' + post.user.username}>{ post.user.username }</a>
          <div id="postdate">{ moment(post.date).fromNow() }</div>
        </div>

        <div className="card-body text-dark">
          <p className="card-text">{ post.content }</p>
        </div>
        <div className="card-footer bg-transparent">Like</div>
      </div>
    ))}
    </div>
  )
}

export default Post
