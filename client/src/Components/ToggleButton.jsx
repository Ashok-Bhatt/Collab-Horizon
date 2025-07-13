import React from 'react'

function ToggleButton(props) {

  const {toggleState, toggleCallback} = props;

  return (
    <div className='flex items-center bg-gray h-[25px] w-[50px] rounded-full px-1' style={{flexDirection: (toggleState ? 'row-reverse' : 'row'), background : (toggleState ? 'blue' : 'gray')}} onClick={()=>{toggleCallback()}}>
      <div className="h-[20px] w-[20px] bg-white rounded-full"></div>
    </div>
  )
}

export default ToggleButton
