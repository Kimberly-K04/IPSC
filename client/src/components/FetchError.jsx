import React from 'react'
import './css/FetchError.css'

function FetchError({error}) {
  return (
    <div className='fetch-error'>
        <img src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW0zdG5taHRhZDZ3cGJzdmxyZTFzMXU1aWdvenBsbG1qZDM0YmNsbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aYpmlCXgX9dc09dbpl/giphy.gif' alt='error gif' />
        <h2>Connection Error</h2>
        <p>Could not Connect To the server <span>{error}</span></p>
        <p>Reload Page to see if it can resolve the issue!</p>
        <p>Or you can also try this link: <a href='https://inventory-prediction.netlify.app/'>BackUp Link</a></p>
    </div>
  )
}

export default FetchError