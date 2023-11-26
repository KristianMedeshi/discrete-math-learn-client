import React from 'react';
import HTMLReactParser from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import { parseHtmlReplace } from '../../utils/helpers';

function CourseAbout({ course }) {
  const [t] = useTranslation('global');

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex gap-5 w-full">
        <img src={course.image} alt="" className="w-[300px] h-[168px]" />
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full gap-10">
            <h1 className="heading-m">{course.name}</h1>
            <p className="heading-s">
              {' '}
              {course.price}
              $
              {' '}
            </p>
          </div>
          <small className="body-text-s">{course.instructors?.join(', ')}</small>
          <p className="body-text-s text-[#808080]">
            {course.duration}
            {' '}
            {t('courses.hours')}
          </p>
          <p className="body-text-s">
            {t(`courses.${course.level}`)}
          </p>
        </div>
      </div>
      <div className="body-text-m">
        {HTMLReactParser(course.description, { replace: parseHtmlReplace })}
      </div>
    </div>
  );
}

export default CourseAbout;
