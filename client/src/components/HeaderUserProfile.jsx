import React from 'react'
import './css/HeaderUserProfile.css'

function HeaderUserProfile({name, avatar}) {
  return (
    <div className='header-user-profile'>
        <img src={avatar} alt="user profile image" />
        <p className='user-username'>{name}</p>
    </div>
  )
}

export default HeaderUserProfile