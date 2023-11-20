import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../../components/PageWrapper';
import Loading from '../Loading';
import { getQuestions } from '../../utils/forumApi';
import formatDate from '../../utils/date';

function Forum() {
  const [t, i18n] = useTranslation('global');
  const [tTags] = useTranslation('tags');
  const { data: questions, isLoading } = useQuery('questions', getQuestions);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="heading-m">{t('forum.questions')}</h1>
          <Link to="/forum/ask" className="button-primary !px-8">{t('forum.askQuestion')}</Link>
        </div>
        <div className="flex flex-col gap-5 py-5">
          {questions?.map((question, index) => (
            <React.Fragment key={question._id}>
              {index > 0 && <div className="divider" />}
              <Link
                to={`/forum/${question._id}`}
                className="flex flex-col gap-3 p-4 rounded-sm hover:bg-secondary mx-5"
              >
                <h2 className="heading-xs">{question.title}</h2>
                <div className="flex gap-2 justify-between">
                  <div className="flex gap-2">
                    {question.tags?.map((tag) => (
                      <div
                        key={tag}
                        className="bg-lines px-2 py-1 rounded-sm whitespace-nowrap h-fit"
                      >
                        {tTags(`${tag}`)}
                      </div>
                    ))}
                  </div>
                  <span>
                    {question.author}
                    ,
                    {' '}
                    {formatDate(question.createdAt, i18n)}
                  </span>
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Forum;
