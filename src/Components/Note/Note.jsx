import React from 'react';
import editIcon from "../../Assets/Icons/edit-icon.svg";
import trashIcon from "../../Assets/Icons/trash-icon.svg";

function Note(props) {
  const [checkedNote, setCheckedNote] = React.useState(props.status === 'complete');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(props.value);
  const [currentText, setCurrentText] = React.useState(props.value);
  const [noteHeight, setNoteHeight] = React.useState();
  const [rmAnim, setRmAnim] = React.useState(false);

  const editRef = React.useRef();
  const textRef = React.useRef();
  const noteParent = React.useRef(null);

  React.useEffect(() => {
    if (isEditing) {
      editRef.current.focus();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setCheckedNote(props.status === 'complete');
  }, [props.status]);

  const handleCheck = () => {
    const newStatus = !checkedNote ? 'complete' : 'incomplete';
    setCheckedNote(!checkedNote);
    props.check(props.index, newStatus); 
    setTimeout(() => {
      props.refresh();
    }, 1000);
  };

  const handleEdit = () => {
    if (isEditing) {
      if (editText !== '') {
        setCurrentText(editText);
        props.edit(props.index, editText);
      }
    }
    setIsEditing(!isEditing);
    props.setNoteEd('');
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
  };

  const rmEditing = () => {
    setIsEditing(!isEditing);
    setEditText(currentText);
    props.setNoteEd('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
  };

  const startEditing = (i) => {
    props.setNoteEd(i);
  };

  const rmNote = (e) => {
    setNoteHeight(0);
    props.rmNote(props.index);
    setRmAnim(!rmAnim);
  };

  React.useEffect(() => {
    if (props.index === props.noteEd) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setEditText(currentText);
    }
  }, [props.index, props.noteEd, currentText]);

  React.useEffect(() => {
    if (noteParent.current) {
      setNoteHeight(noteParent.current.offsetHeight);
    }
  }, [props.list, props.noteEd]);

  return (
    <div className={`note-parent ${rmAnim ? 'isAnim' : ''}`} ref={noteParent} style={{height: noteHeight + "px"}}>
      <div className={`note ${checkedNote ? 'note_checked' : ''}`}>
        <div className='note__checkbox' onClick={handleCheck}></div>
        <div
          className='note__text'
          onClick={handleCheck}
          style={{ display: isEditing ? 'none' : 'flex' }}
          ref={textRef}
        >
          {currentText}
        </div>
        <input
          type='text'
          className='note__input'
          ref={editRef}
          value={editText}
          style={{ display: isEditing ? 'flex' : 'none' }}
          onChange={handleInputChange}
          onKeyDown={handleKey}
          onBlur={e => e.target.focus()}
        />
        <div className={`note-actions ${isEditing ? 'visible' : ''}`}>
          <button className='note-actions__button note-actions__button_edit' onClick={handleEdit} style={{ display: isEditing ? 'flex' : 'none' }}></button>
          <button className='note-actions__button note-actions__button_edit' onClick={() => startEditing(props.index)} style={{ display: isEditing ? 'none' : 'flex' }}>
            <img src={editIcon} width='18' height='18' alt="" />
          </button>
          <button className='note-actions__button note-actions__button_rm' onClick={rmNote} style={{ display: isEditing ? 'none' : 'flex' }}>
            <img src={trashIcon} width='18' height='18' alt="" />
          </button>
          <button className='note-actions__button note-actions__button_rm' onClick={rmEditing} style={{ display: isEditing ? 'flex' : 'none' }}></button>
        </div>
      </div>
    </div>
  );
}

export default Note;
