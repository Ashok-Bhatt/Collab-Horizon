import React from 'react'
import {Notifications} from "../Components/export.js"

function Explore() {
  return (
    <div className='flex-grow w-full overflow-y-auto'>
      <div className="flex w-full justify-end">
        <Notifications/>
      </div>
    </div>
  )
}

export default Explore
