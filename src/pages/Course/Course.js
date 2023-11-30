import React from 'react';
import { useQuery } from 'react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaLock } from 'react-icons/fa';
import Loading from '../Loading';
import CourseAbout from './CourseAbout';
import CourseBlock from './CourseBlock';
import { getCourse } from '../../utils/coursesApi';
import './Course.scss';

function Course() {
  const [t] = useTranslation('global');
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const blockParam = searchParams.get('block');
  const { data, isLoading } = useQuery(`courses/${id}`, async () => getCourse(id));
  const { course, blocks } = data ?? {};

  const setBlock = (block) => {
    setSearchParams((prev) => ({ ...prev, block }));
  };

  if (isLoading) {
    return <Loading className="w-full" />;
  }

  return (
    <div className="page-wrapper w-full flex-row">
      <div className="flex flex-col gap-2 w-1/4">
        <button
          type="button"
          onClick={() => setBlock('')}
          className="sidebar-tab"
        >
          {t('courses.about')}
        </button>
        {blocks?.map((block) => (
          <React.Fragment key={block.title}>
            <div className="divider-x" />
            <button
              type="button"
              onClick={() => setBlock(block._id)}
              className={`sidebar-tab flex items-center justify-center relative
                ${course.isBought ? 'bg-primary' : 'bg-secondary pointer-events-none'}`}
            >
              {block.title}
              <FaLock className="absolute right-3" hidden={course.isBought} />
              <FaCheck className="absolute right-3" hidden={!block.isPassed} />
            </button>
          </React.Fragment>
        ))}
        {course.isAuthor && (
        <>
          <div className="divider-x" />
          <Link
            to={`/courses/${id}/add`}
            className="sidebar-tab text-center"
          >
            {t('courses.addBlock')}
          </Link>
        </>
        )}
      </div>
      <div className="divider-y mx-2" />
      <div className="w-full">
        {blockParam ? <CourseBlock id={blockParam} /> : <CourseAbout course={course} />}
      </div>
    </div>
  );
}

export default Course;
