import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import Slider from 'rc-slider';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../../components/PageWrapper';
import Loader from '../../components/Loader/Loader';
import { getCourses } from '../../utils/coursesApi';
import 'rc-slider/assets/index.css';
import './Home.scss';
import Pagination from '../../components/Pagination/Pagination';

function Home() {
  const [t] = useTranslation('global');
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const [checkedDifficulties, setCheckedDifficulties] = useState([]);
  const minDuration = 0;
  const maxDuration = 100;
  const [inputMinDuration, setInputMinDuration] = useState(minDuration);
  const [inputMaxDuration, setInputMaxDuration] = useState(maxDuration);
  const [durationRange, setDurationRange] = useState([minDuration, maxDuration]);
  const {
    data, isLoading,
  } = useQuery(
    ['courses', skip, checkedDifficulties, durationRange],
    async () => getCourses(skip, limit, checkedDifficulties, durationRange),
  );
  const { courses, resultsLength } = data ?? {};

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    setCheckedDifficulties((prevDifficulties) => {
      if (checked) {
        return [...prevDifficulties, value];
      }
      return prevDifficulties.filter((difficulty) => difficulty !== value);
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
    <PageWrapper className="!flex-row w-full">
      <div className="flex gap-5 flex-col h-full w-3/12 filter">
        <div className="flex justify-between items-center mt-3">
          <h1 className="heading-s">{t('courses.filter')}</h1>
          <p className="body-text-m text-[#909090]">
            {resultsLength}
            {' '}
            {t('courses.results')}
          </p>
        </div>
        <div className="flex flex-col">
          <h6 className="heading-xs mb-2">{t('courses.difficulty')}</h6>
          <label htmlFor="beginner" className="filter-checkbox">
            <input
              id="beginner"
              type="checkbox"
              value="Beginner"
              checked={checkedDifficulties.includes('Beginner')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.Beginner')}</p>
          </label>
          <label htmlFor="intermediate" className="filter-checkbox">
            <input
              id="intermediate"
              type="checkbox"
              value="Intermediate"
              checked={checkedDifficulties.includes('Intermediate')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.Intermediate')}</p>
          </label>
          <label htmlFor="expert" className="filter-checkbox">
            <input
              id="expert"
              type="checkbox"
              value="Expert"
              checked={checkedDifficulties.includes('Expert')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.Expert')}</p>
          </label>
          <label htmlFor="allLevels" className="filter-checkbox">
            <input
              id="allLevels"
              type="checkbox"
              value="All levels"
              checked={checkedDifficulties.includes('All levels')}
              onChange={handleCheckboxChange}
            />
            <p>{t('courses.All levels')}</p>
          </label>
        </div>
        <div className="divider" />
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
            onClick={() => setDurationRange([inputMinDuration, inputMaxDuration])}
          >
            OK
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-5">
          <h1 className="heading-m mx-10">{t('courses.courses')}</h1>
          <div className="flex flex-col h-full gap-5 justify-between">
            {courses?.map((course, index) => (
              <React.Fragment key={course._id}>
                {index > 0 && <div className="divider" />}
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
                      {course.teachers?.map((teacher, index) => (
                        <div key={course._id + teacher}>
                          {index > 0 && ', '}
                          {teacher}
                        </div>
                      ))}
                    </div>
                    <p className="body-text-s text-[#808080]">
                      {course.duration}
                      {' '}
                      {t('courses.hours')}
                    </p>
                    <p className="body-text-s">
                      {t(`courses.${course.difficulty}`)}
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
    </PageWrapper>
  );
}

export default Home;
