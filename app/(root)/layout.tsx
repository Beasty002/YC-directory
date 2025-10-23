import React from 'react'

const layout = ({children} : {children : React.ReactNode}) => {
  return (
    <main>
        <h1 className='text-blue-600'>Welcome to the Root Layout</h1>
        {children}
    </main>
  )
}

export default layout