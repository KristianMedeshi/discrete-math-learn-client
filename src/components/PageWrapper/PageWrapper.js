import React from 'react';

function PageWrapper({ className, children }) {
  return (
    <div className={`flex flex-col gap-5 min-h-[85vh] min-w-[80vw] bg-primary px-7 py-10
      border border-lines rounded-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default PageWrapper;
