import React from 'react';
import Select from "react-select"
import notes from './Assets/Data/notes.json';
import Popup from './Components/PopUpModal/PopUpModal';
import SearchInput from './Components/Inputs/NoteSearch';
import Note from './Components/Note/Note';
import Undo from './Components/Undo/Undo';
import crossIcon from './Assets/Icons/cross.svg';
import imgLight from './Assets/Imgs/img1.png';
import imgDark from './Assets/Imgs/img2.png';
import sunIcon from "./Assets/Icons/sun-icon.svg"
import moonIcon from "./Assets/Icons/moon-icon.svg"

const options = [
  { value: 'all', label: 'All' },
  { value: 'complete', label: 'Complete' },
  { value: 'incomplete', label: 'Incomplete' },
];

function App() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [filterOption, setFilterOption] = React.useState(options[0]);
  const [newNoteText, setNewNoteText] = React.useState('');
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [isUndoActive, setIsUndoActive] = React.useState(false);
  const [countdown, setCountdown] = React.useState(5);
  const [filteredNotes, setFilteredNotes] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const [noteEditing, setNoteEditing] = React.useState('');
  const [todos, setTodos] = React.useState(() => {
    return notes;
  });
  const [archivedTodos, setArchivedTodos] = React.useState([]);
  const [searching, setSearching] = React.useState('');
  const inputRef = React.useRef();
  const timerRef = React.useRef();

  React.useEffect(() => {
    let savedNotes = localStorage.getItem('notesArr');
    if (savedNotes) {
      setTodos(JSON.parse(localStorage.getItem('notesArr')));
    }
  }, []);

  const updNotes = React.useCallback(() => {
    localStorage.setItem('notesArr', JSON.stringify(todos));
  }, [todos]);

  React.useEffect(() => {
    updNotes();
  }, [todos, updNotes]);

  React.useEffect(() => {
    if (todos.length === 0 || filteredNotes.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    updNotes();
  }, [todos, filteredNotes, updNotes]);

  const openPopup = () => {
    setIsPopupOpen(!isPopupOpen);
    inputRef.current.focus();
  };

  const cancelForm = (e) => {
    setIsPopupOpen(!isPopupOpen);
    e.preventDefault();
  };

  const closePopup = (e) => {
    if (e.target.id === 'popup-card') {
      setIsPopupOpen(!isPopupOpen);
    }
  };

  const clickToEsc = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const listenInput = (e) => {
    setNewNoteText(e.target.value);
  };

  const publicNote = (e) => {
    if (newNoteText !== '') {
      setTodos([{ text: newNoteText, checked: 'incomplete' }, ...todos]);
      setNewNoteText('');
      inputRef.current.value = '';
      setFilterOption(options[0]);
    }

    setIsPopupOpen(!isPopupOpen);
    e.preventDefault();
  };

  const startTimer = () => {
    setCountdown(timer => 5);
    timerRef.current = setInterval(() => {
      setCountdown(timer => timer - 1);
    }, 1000);
  };

  React.useEffect(() => {
    if (countdown <= 0) {
      handleUndo();
      clearInterval(timerRef.current);
      setTimeout(() => {
        setCountdown(timer => 5);
      }, 300);
    }
  }, [countdown]);

  const clickToRm = (i) => {
    let newNotes;
    newNotes = [...todos];
    setArchivedTodos([...todos]);
    newNotes.splice(i, 1);
    setTimeout(() => {
      setTodos(newNotes);
    }, 300);
    setNoteEditing('');

    if (isUndoActive === true) {
      setCountdown(timer => 5);
      handleUndo();
      clearInterval(timerRef.current);
      setTimeout(() => {
        setCountdown(timer => 5);
        handleUndo();
        startTimer(countdown);
      }, 300);
    } else {
      handleUndo();
      startTimer();
    }
  };

  const handleUndo = () => {
    setIsUndoActive(isUndoActive => !isUndoActive);
  };

  const clickToUndo = () => {
    handleUndo();
    clearInterval(timerRef.current);
    setTodos(archivedTodos);
  };

  const clickToEdit = (i, text) => {
    todos[i].text = text;
    updNotes();
  };

  const refreshFiltering = React.useCallback(() => {
    setFilteredNotes(
      todos.filter(obj => {
        if (filterOption.value === 'all') {
          return true;
        } else if (obj.checked === filterOption.value) {
          return true;
        }
        return false;
      }).filter(obj => {
        if (obj.text.toLowerCase().includes(searching.toLowerCase())) {
          return true;
        }
        return false;
      })
    );
  }, [todos, filterOption, searching]);

  const clickToCheck = (i) => {
    if (filteredNotes[i].checked === 'complete') {
      filteredNotes[i].checked = 'incomplete';
    } else {
      filteredNotes[i].checked = 'complete';
    }
    updNotes();
  };

  React.useEffect(() => {
    refreshFiltering();
  }, [todos, filterOption, searching, refreshFiltering]);

  const renderedNotes = filteredNotes.map((obj, i) =>
    <Note
      key={`${obj.text}${i}`}
      value={obj.text}
      status={obj.checked}
      index={i}
      check={clickToCheck}
      rmNote={clickToRm}
      edit={clickToEdit}
      noteEd={noteEditing}
      setNoteEd={setNoteEditing}
      list={todos}
      category={filterOption}
      emptyCheck={setIsEmpty}
      refresh={refreshFiltering}
    />
  );

  const toggleDarkTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`wrapper ${isDarkMode ? 'dark' : ''}`}>
      <header className="header">
        <div className="header__container">
          <h1 className="header__title">TODO LIST</h1>
          <div className='header__nav-panel'>
            <SearchInput searchText={setSearching} text={searching} />

            <Select
  defaultValue={filterOption}
  onChange={(selectedOption) => setFilterOption(selectedOption)}
  options={options}
  value={filterOption}
  className="react-select-container"
  classNamePrefix="react-select"
/>

            <button className='change-scheme-btn' onClick={toggleDarkTheme}>
              {isDarkMode ? (
                <img src={sunIcon} alt="Sun Icon"/>
              ) : (
                <img src={moonIcon} alt='Moon Icon'/>
              )}
            </button>

            <button className="add-note-btn" onClick={() => openPopup()}>
              <span>New note</span>
              <img src={crossIcon} alt="" />
            </button>
          </div>
        </div>
      </header>
      <main className="main">
        <section className="main__list list">
          <div className="list__container">
            <div className="list__container-small">
              {renderedNotes}

              {isEmpty && (
                <div className="empty">
                  <div className="empty__preview">
                    <img
                      src={isDarkMode ? imgDark : imgLight}
                      alt=""
                      className="empty__preview-img"
                    />
                  </div>
                  <p className="empty__message">Empty... </p>
                </div>
              )}

              <Undo show={isUndoActive} tRef={timerRef} timer={countdown} undo={clickToUndo} />
            </div>
          </div>
        </section>

        <Popup marker={isPopupOpen} cancelClick={cancelForm} closePopup={closePopup} esc={clickToEsc} listenInput={listenInput} publicNote={publicNote} uRef={inputRef} />

      </main>
    </div>
  );
}

export default App;
