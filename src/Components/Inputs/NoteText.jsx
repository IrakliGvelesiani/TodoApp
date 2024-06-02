import React from 'react'

const NoteText = (props) => {
  return (
    <div className='field'>
        <input className='field__input field__input_p' placeholder='Input your note...' onChange={props.listenI} ref={props.uRef} />
    </div>
  )
}

export default NoteText