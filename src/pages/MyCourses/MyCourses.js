import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Image from '../../components/Image';
import Pagination from '../../components/Pagination';
import { getMyCourses } from '../../utils/coursesApi';
import Loader from '../../components/Loader';

function MyCourses() {
  const [t] = useTranslation('global');
  const limit = 12;
  const [skip, setSkip] = useState(0);
  const { data } = useQuery(['courses/my', skip], () => getMyCourses({ skip, limit }));
  const { courses, totalCount } = data ?? {};

  return (
    <div className="page-wrapper w-full gap-10">
      <h1 className="heading-m">{t('myCourses')}</h1>
      {!courses
        ? (
          <div className="flex w-full h-full justify-center items-center">
            <Loader />
          </div>
        )
        : (
          <div className="contents">
            <div className="flex flex-wrap gap-6 justify-between">
              {courses?.map((course) => (
                <Link
                  to={`/courses/${course._id}`}
                  key={course._id}
                  className="flex flex-col gap-2 justify-start rounded-[4px]
                    items-center w-[250px] px-2 hover:bg-secondary"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-[250px] h-[140px]"><Image imageSrc={course.image} /></div>
                    <div className="flex w-[240px] bg-lines h-1 mt-2">
                      <div
                        className="h-full bg-lightPurple"
                        style={{ width: `${course.total ? (100 * course.passed) / course.total : 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 w-full justify-between pb-2">
                    <p className="body-text-m">{course.name}</p>
                    <small className="body-text-s">
                      {course.total ? (100 * course.passed) / course.total : 100}
                      %
                    </small>
                  </div>
                </Link>
              ))}
            </div>
            <Pagination
              skip={skip}
              setSkip={setSkip}
              limit={limit}
              resultsLength={totalCount}
            />
          </div>
        )}
    </div>
  );
}

export default MyCourses;
