import React from 'react';
import Loader from '../../components/Loader';

function Loading({ className }) {
  return (
    <div className={`page-wrapper ${className}`}>
      <div className="flex justify-center items-center w-full h-[60vh]">
        <Loader />
      </div>
    </div>
  );
}

export default Loading;
