import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../../components/PageWrapper';
import Loading from '../Loading';
import { getQuestions } from '../../utils/network';
import formatDate from '../../utils/date';

function Forum() {
  const [t, i18n] = useTranslation('global');
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
        <div className="flex flex-col gap-5">
          {questions?.map((question) => (
            <Link
              key={question._id}
              to={`/forum/${question._id}`}
              className="p-4 rounded-md bg-secondary outline-lightPurple outline-1 hover:outline"
            >
              <h2 className="heading-xs">{question.title}</h2>
              <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                  {question.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="bg-lines px-2 py-1 rounded-sm whitespace-nowrap h-fit"
                    >
                      {tag}

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
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

export default Forum;
