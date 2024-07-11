import React, { useState } from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  
  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `(${x}, ${y})`;
  }

  function getStepsMessage() {
    return `You moved ${steps} time${steps !== 1 ? 's' : ''}`;
  }

  function resetState() {
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function reset() {
    setMessage(initialMessage);
    resetState();
  }

  function getNextIndex(direction) {
    const x = index % 3;
    const y = Math.floor(index / 3);
    switch (direction) {
      case 'left':
        return x > 0 ? index - 1 : index;
      case 'up':
        return y > 0 ? index - 3 : index;
      case 'right':
        return x < 2 ? index + 1 : index;
      case 'down':
        return y < 2 ? index + 3 : index;
      default:
        return index;
    }
  }

  function move(evt) {
    const direction = evt.target.id;
    const newIdx = getNextIndex(direction);
    if (newIdx !== index) {
      setIndex(newIdx);
      setSteps(steps + 1);
      setMessage(initialMessage);
    } else {
      setMessage(`You can't go ${direction}`);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    setMessage('');  

    if (!email) {
      setMessage('Ouch: email is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Ouch: email must be a valid email.');
      return;
    }

    const { x, y } = getXY();
    console.log('Submitting:', { email, steps, x, y }); 

    try {
      const response = await axios.post('http://localhost:9000/api/result', { email, steps, x, y });
      console.log('Response:', response.data);  
      if (response.data && response.data.message) {
        setMessage(response.data.message);
        resetState(); 
      } else {
        setMessage('Ouch: an error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Ouch: ${error.response.data.message}`);
      } else {
        setMessage('Ouch: an error occurred. Please try again.');
      }
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{getStepsMessage()}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
