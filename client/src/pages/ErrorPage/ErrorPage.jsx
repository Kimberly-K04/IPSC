import React from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorPage() {
    const error= useRouteError()
    console.log(error)
  return (
    <section>
        <h1>Whoops! Something went wrong!</h1>
        <p>{error}</p>
    </section>
  )
}

export default ErrorPage