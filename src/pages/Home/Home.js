import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Slider from 'rc-slider';
import Loader from '../../components/Loader/Loader';
import Pagination from '../../components/Pagination/Pagination';
import { getCourses } from '../../utils/coursesApi';
import 'rc-slider/assets/index.css';
import './Home.scss';

function Home() {
  const [t] = useTranslation('global');
  const [skip, setSkip] = useState(0);
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const limit = 10;
  const minDuration = 0;
  const maxDuration = 100;
  const [inputMinDuration, setInputMinDuration] = useState(minDuration);
  const [inputMaxDuration, setInputMaxDuration] = useState(maxDuration);
  const [searchParams, setSearchParams] = useSearchParams();
  const levels = searchParams.getAll('levels');
  const duration = searchParams.getAll('duration');

  const {
    data, isLoading,
  } = useQuery(
    ['courses', skip, levels, duration],
    async () => getCourses(skip, limit, levels, duration),
  );
  const { courses, resultsLength } = data ?? {};

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSearchParams((prev) => {
      if (checked) {
        prev.append('levels', value);
      } else {
        prev.delete('levels', value);
      }
      return prev;
    });
  };

  const handleRangeChange = () => {
    setSearchParams((prev) => {
      prev.set('duration', inputMinDuration);
      prev.append('duration', inputMaxDuration);
      return prev;
    });
  };

  const handleInputMinDurationChange = (event) => {
    let value = Number(event.target.value);
    if (Number.isNaN(value)) {
      value = minDuration;
    }
    setInputMinDuration(Math.max(value, minDuration));
  };

  const handleInputMaxDurationChange = (event) => {
    let value = Number(event.target.value);
    if (Number.isNaN(value)) {
      value = maxDuration;
    }
    setInputMaxDuration(Math.min(value, maxDuration));
  };

  return (
    <div className="page-wrapper !flex-row w-full">
      <div className="flex gap-5 flex-col h-full w-3/12 filter">
        <div className="flex justify-between items-center mt-3">
          <h1 className="heading-s">{t('courses.filter')}</h1>
          <p className="body-text-m text-[#909090]" hidden={isLoading}>
            {resultsLength}
            {' '}
            {t('courses.results')}
          </p>
        </div>
        <div className="flex flex-col">
          <h6 className="heading-xs mb-2">{t('courses.level')}</h6>
          <label htmlFor="beginner" className="filter-checkbox">
            <input
              id="beginner"
              type="checkbox"
              value="Beginner"
              checked={levels.includes('Beginner')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.Beginner')}</p>
          </label>
          <label htmlFor="intermediate" className="filter-checkbox">
            <input
              id="intermediate"
              type="checkbox"
              value="Intermediate"
              checked={levels.includes('Intermediate')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.Intermediate')}</p>
          </label>
          <label htmlFor="expert" className="filter-checkbox">
            <input
              id="expert"
              type="checkbox"
              value="Expert"
              checked={levels.includes('Expert')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.Expert')}</p>
          </label>
          <label htmlFor="allLevels" className="filter-checkbox">
            <input
              id="allLevels"
              type="checkbox"
              value="All levels"
              checked={levels.includes('All levels')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.All levels')}</p>
          </label>
        </div>
        <div className="divider-x" />
        <h6 className="heading-xs mb-2">{t('courses.duration')}</h6>
        <Slider
          range
          min={minDuration}
          max={maxDuration}
          value={[inputMinDuration, inputMaxDuration]}
          onChange={(range) => {
            setInputMinDuration(range[0]);
            setInputMaxDuration(range[1]);
          }}
        />
        <div className="flex justify-between w-full items-center">
          <label htmlFor="inputMinDuration" className="label-borders range-field">
            <input
              id="inputMinDuration"
              type="text"
              value={inputMinDuration}
              className="range-input"
              onChange={handleInputMinDurationChange}
            />
          </label>
          <label htmlFor="inputMaxDuration" className="label-borders range-field">
            <input
              id="inputMaxDuration"
              type="text"
              value={inputMaxDuration}
              className="range-input"
              onChange={handleInputMaxDurationChange}
            />
          </label>
          <button
            type="button"
            disabled={inputMinDuration > inputMaxDuration}
            className="button-primary px-5 py-1 rounded-md"
            onClick={handleRangeChange}
          >
            OK
          </button>
        </div>
      </div>
      <div className="divider-y" />
      {isLoading ? (
        <div className="flex w-full justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-5">
          <div className="flex justify-between">
            <h1 className="heading-m mx-10">{t('courses.courses')}</h1>
            <Link to="/courses/add" className="button-primary px-5" hidden={!isLoggedIn}>
              {t('courses.add')}
            </Link>
          </div>
          <div className="flex flex-col h-full gap-5 justify-between">
            {courses?.map((course, index) => (
              <React.Fragment key={course._id}>
                {index > 0 && <div className="divider-x" />}
                <Link
                  to={`/courses/${course._id}`}
                  className="flex items-center gap-6 mx-10 hover:bg-secondary"
                >
                  <img src={course.image} alt="" />
                  <div>
                    <h5 className="flex gap-5 justify-between heading-xs">
                      <p>{course.name}</p>
                      <p>
                        {' '}
                        {course.price}
                        $
                        {' '}
                      </p>
                    </h5>
                    <div className="flex body-text-s">
                      {course.instructors?.join(', ')}
                    </div>
                    <p className="body-text-s text-[#808080]">
                      {course.duration}
                      {' '}
                      {t('courses.hours')}
                    </p>
                    <p className="body-text-s">
                      {t(`courses.${course.level}`)}
                    </p>
                  </div>
                </Link>
              </React.Fragment>
            ))}
            <Pagination
              skip={skip}
              setSkip={setSkip}
              limit={limit}
              resultsLength={resultsLength}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
