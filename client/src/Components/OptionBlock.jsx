import React from 'react'

function OptionBlock(props) {

  const {mainText, acceptText, cancelText, acceptCallback, cancelCallback} = props;

  return (
    <div className='flex flex-col justify-around items-center absolute top-1/2 left-1/2 -translate-1/2 h-50 w-80 rounded-lg border-2 p-2'>
      <p className="text-2xl">{mainText}</p>
      <div className="flex justify-between">
        <button className="bg-green-400 text-lg rounded px-5 py-1" onClick={acceptCallback}>{acceptText}</button>
        <button className="bg-red-400 text-lg rounded px-5 py-1" onClick={cancelCallback}>{cancelText}</button>
      </div>
    </div>
  )
}

export default OptionBlock
