import React from 'react'
import {v4 as uuid} from "uuid";

function Select(props) {

  const {label, options, errorObj, ...rest} = props;

  return (
    <div className='flex flex-col'>
        <label>{label}</label>
        <select {...rest}>
            {
                options.map((option)=>(
                    <option value={option} key={uuid()}>{option}</option>
                ))
            }
        </select>

        {errorObj && <p className='text-red-600'>{errorObj?.message}</p>}
    </div>
  )
}

export default Select