import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Image from '../../components/Image';
import Loading from '../Loading';
import { getQuestions } from '../../utils/forumApi';
import formatDate from '../../utils/date';

function Forum() {
  const [t, i18n] = useTranslation('global');
  const [tTags] = useTranslation('tags');
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
              <Link
                to={`/forum/${question._id}`}
                className="flex flex-col gap-3 p-4 rounded-sm hover:bg-secondary mx-5"
              >
                <h2 className="heading-xs">{question.title}</h2>
                <div className="flex gap-2">
                  {question.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="bg-secondary border border-lines
                        px-2 py-1 rounded-sm whitespace-nowrap h-fit"
                    >
                      {tTags(`${tag}`)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 self-end">
                  <Image className="!w-8 !h-8" imageSrc={question.author.image} />
                  {question.author.fullName}
                  ,
                  {' '}
                  {formatDate(question.createdAt, i18n)}
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forum;
