import React from 'react'

function MessageBox(props) {

    const {containerClasses="", text, textClasses=""} = props;

  return (
    <div className={`${containerClasses} flex justify-center items-center`}>
        <p className={`${textClasses}`}>{text}</p>
    </div>
  )
}

export default MessageBox
