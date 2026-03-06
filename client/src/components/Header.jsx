import React from 'react'
import IPSC from '../assets/logo.png'
import './css/Header.css'
import HeaderUserProfile from './HeaderUserProfile'

function Header({users}) {
  const mappedUser = users.map(users=>{
    return(
      <HeaderUserProfile
        key={users.id}
        name={users.name}
        avatar={users.avatar}
      />
    )
  })
  return (
    <header className='main-header'>
        <div className='main-header-logo'>
            <img src={IPSC}/>
            <p>Inventory Prediction and Supply Chain- (IPSC)</p>
        </div>
        <div>
          {mappedUser}
        </div>
    </header>
  )
}

export default Header