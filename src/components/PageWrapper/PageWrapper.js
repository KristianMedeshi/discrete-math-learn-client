import React from 'react';

function PageWrapper({ className, children }) {
  return (
    <div className={`flex flex-col gap-5 min-h-[70vh] desktop:max-w-[70vw] bg-primary px-7 py-10
    border border-lines rounded-[4px] ${className}`}
    >
      {children}
    </div>
  );
}

export default PageWrapper;
