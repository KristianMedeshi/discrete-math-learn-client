import React from 'react';

function Image({ imageSrc, className }) {
  return (
    <div
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
      className={`overflow-hidden w-full h-full ${className}`}
    />
  );
}

export default Image;
