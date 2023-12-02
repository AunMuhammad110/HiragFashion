import React, { useState } from 'react';
import './card.css'
const NumberControl = () => {
  const [number, setNumber] = useState(0);

  const increment = () => {
    setNumber(number + 1);
  };

  const decrement = () => {
    if (number > 0) {
      setNumber(number - 1);
    }
  };

  return (
    <div className="number-control">
      <h3 className='qty'>Quantity&nbsp;&nbsp;</h3>
      <button className="control-button-l" onClick={decrement}>-</button>
      <div className="number">{number}</div>
      <button className="control-button-r" onClick={increment}>+</button>
    </div>
  );
};

export default NumberControl;
