import React from 'react';

function UserImage({ imageSrc, className }) {
  return (
    <div
      style={{
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
      className={`overflow-hidden ${className}`}
    />
  );
}

export default UserImage;
