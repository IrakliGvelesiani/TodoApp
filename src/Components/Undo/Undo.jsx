import React from 'react'
import undoIcon from '../../Assets/Icons/undo-icon.svg';

export const Undo = (props) => {
  return (
    <div className={`undo ${props.show ? `active` : ''}`} onClick={props.undo} >
        <div className="undo__timer timer">
            <div className="timer__sec" ref={props.tRef}>{props.timer}</div>
        </div>
        <div className="undo__text">undo</div>
        <div className="undo__icon">
            <img src={undoIcon} alt="" />
        </div>
    </div>
  )
}
export default Undo;