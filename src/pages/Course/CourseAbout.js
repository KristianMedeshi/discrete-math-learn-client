import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import useModal from '../../hooks/useModal';
import ModalContainer from '../../components/ModalContainer';
import BuyCourseModal from '../../components/BuyCourseModal';

function CourseAbout({ course }) {
  const { modalOpen, open, close } = useModal();
  const [t] = useTranslation('global');

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex gap-5 w-full">
        <img src={course.image} alt="" className="w-[300px] h-[168px]" />
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full gap-10">
            <h1 className="heading-m">{course.name}</h1>
            <button
              type="button"
              className="button-primary whitespace-nowrap px-5 cursor-pointer"
              hidden={course.isBought}
              onClick={open}
            >
              {t('courses.buy')}
              {' '}
              {course.price}
              $
              {' '}
            </button>
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
        <ReactQuill
          value={course.description}
          readOnly
          modules={{ toolbar: false }}
        />
      </div>
      <ModalContainer>
        {modalOpen && (
        <BuyCourseModal
          modalOpen={modalOpen}
          handleClose={close}
          course={course}
        />
        )}
      </ModalContainer>
    </div>
  );
}

export default CourseAbout;
