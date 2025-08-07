import React from 'react'

function Input(props) {

  const {placeholder="", inputType="text", errorObj=null, ...rest} = props;

  return (
    <div className='flex flex-col'>
        <input type={inputType} placeholder={placeholder} className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-lg' {...rest}/>

        {errorObj && <p className='text-red-600'>{errorObj?.message}</p>}
    </div>
  )
}

export default Input