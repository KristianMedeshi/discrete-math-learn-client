import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Loading from '../Loading';
import { getQuestions } from '../../utils/forumApi';
import Question from './Question';

function Forum() {
  const [t] = useTranslation('global');
  const userId = useSelector((state) => state.auth.userId);
  const { data: questions, isLoading } = useQuery(`${userId}/questions`, getQuestions);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="heading-m">{t('forum.questions')}</h1>
          <Link to="/forum/ask" className="button-primary !px-8">{t('forum.askQuestion')}</Link>
        </div>
        <div className="flex flex-col gap-5 py-5">
          {questions?.map((question, index) => (
            <React.Fragment key={question._id}>
              {index > 0 && <div className="divider-x" />}
              <Question question={question} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forum;
