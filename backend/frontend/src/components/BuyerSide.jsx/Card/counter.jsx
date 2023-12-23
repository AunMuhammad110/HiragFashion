import React, { useEffect, useState } from 'react';
import './card.css'
const NumberControl = ({stock,disableButton}) => {
  const [number, setNumber] = useState(1);
  const [showError, setShowError] = useState(false);

  const increment = () => {
    setNumber(number + 1);
  };

  const decrement = () => {
    if (number > 0) {
      setNumber(number - 1);
    }
  };
  useEffect(()=>{
    if(number> stock){ 
      setShowError(true);
      disableButton(1);
    }
    
    else{
      setShowError(false);
      disableButton(0)
    }
  },[number])

  return (
    <div>
      <div className="number-control">
      <h3 className='qty'>Quantity&nbsp;&nbsp;</h3>
      <button className="control-button-l" onClick={decrement}>-</button>
      <div className="number">{number}</div>
      <button className="control-button-r" onClick={increment}>+</button>
    </div>
    {showError && <p className='colr'>Can not buy {number}, only 4 left</p>}
    </div>
  );
};

export default NumberControl;
