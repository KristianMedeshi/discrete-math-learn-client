import React from 'react';
import { PulseLoader } from 'react-spinners';

function Loader() {
  return (
    <PulseLoader
      color="var(--color-light-purple)"
      speedMultiplier={0.4}
    />
  );
}

export default Loader;
