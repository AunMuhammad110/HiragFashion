import React from "react";

const useBoolean = (initialState = false) => {
  const [state, setState] = React.useState(initialState);
  const handleTrue = () => setState(true);
  const handleFalse = () => setState(false);
  const handleToggle = () => setState(!state);

  return [
    state,
    {
      setTrue: handleTrue,
      setFalse: handleFalse,
      setToggle: handleToggle,
    },
  ];
};

export default useBoolean;
