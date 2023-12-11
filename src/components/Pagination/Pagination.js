import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Pagination({
  skip, setSkip, limit, resultsLength,
}) {
  const buttonsCount = 7;
  const currentPage = skip / limit + 1;
  const [pages, setNumbers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page) => {
    setSkip(Math.max(0, limit * (page - 1)));
    setSearchParams((prev) => {
      prev.set('page', page);
      return prev;
    });
    console.log(searchParams);
  };

  useEffect(() => {
    let first = Math.max(1, currentPage - Math.ceil((buttonsCount - 1) / 2));
    const last = Math.min(first + buttonsCount, Math.ceil(resultsLength / limit) + 1);
    if (last - first < buttonsCount) {
      first = Math.max(1, last - buttonsCount);
    }
    const pageNumbers = Array.from({ length: last - first }, (_, index) => first + index);
    setNumbers(pageNumbers);
    if (currentPage >= last) {
      handlePageChange(last - 1);
    }
  }, [resultsLength]);

  return (
    <div className="flex gap-3 justify-center w-full mt-auto">
      {pages.map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => handlePageChange(page)}
          className={`label-borders w-10 h-10 rounded-sm !cursor-pointer
            ${(currentPage === page) ? 'active-focus' : ''} `}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
