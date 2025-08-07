import React from 'react'

function ListItem(props) {

  const {label, cancelListener} = props;

  return (
    <div className='flex items-center rounded-lg px-5 py-1 gap-x-2 bg-gray-100 text-blue-400'>
      <p className=''>{label}</p>
      <button className='border-0 rounded-full p-1 hover:cursor-pointer hover:bg-gray-300' type="button" onClick={cancelListener}>X</button>
    </div>
  )
}

export default ListItem
