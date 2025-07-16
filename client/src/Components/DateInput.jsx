import React from 'react';

function DateInput(props) {
  const { placeholder, errorObj, ...rest } = props;

  return (
    <div className='flex flex-col'>
      <input
        type="date"
        placeholder={placeholder}
        className='text-black w-100 bg-green-50 border border-green-300 px-5 py-2 rounded-full'
        {...rest}
      />

      {errorObj && <p className='text-red-600'>{errorObj?.message}</p>}
    </div>
  );
}

export default DateInput;