import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './UsernamePopup.css';

const UsernamePopup = ({ setUserName }) => {
  const [nameInput, setNameInput] = useState('');
  const [animationClass, setAnimationClass] = useState('enter'); // Initial animation class

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setAnimationClass('exit'); // Trigger exit animation
      setTimeout(() => {
        setUserName(nameInput.trim());
      }, 300); // Delay to match the animation duration
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  return (
    <div className={`popup ${animationClass}`}>
      <div className="popup-content">
        <h2>Enter your username</h2>
        <TextField
          label="Username"
          variant="filled"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown} // Submit on "Enter"
          fullWidth
          autoFocus
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleNameSubmit}
          style={{ marginTop: '1em' }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UsernamePopup;
