import React from 'react'

function SettingOption(props) {

  const {settingOptionText, settingOptionBlock=null, ...rest} = props;

  return (
    <div className='flex w-full h-15 px-5 justify-between items-center rounded-lg' {...rest}>
      <p>{settingOptionText}</p>
      {settingOptionBlock}
    </div>
  )
}

export default SettingOption
