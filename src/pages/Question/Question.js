import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';
import RichEditor from '../../components/RichEditor';
import PageWrapper from '../../components/PageWrapper';
import UserImage from '../../components/UserImage';
import Loading from '../Loading';
import { createAnswer, getQuestion } from '../../utils/forumApi';
import formatDate from '../../utils/date';

function Question() {
  const [t, i18n] = useTranslation('global');
  const { questionId } = useParams();
  const { data, isLoading } = useQuery(questionId, () => getQuestion(questionId));
  const { question, answers } = data || {};
  const [answer, setAnswer] = useState('');

  const queryClient = useQueryClient();
  const postAnswerMutation = useMutation(async (postData) => {
    await createAnswer(questionId, postData);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(questionId);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    postAnswerMutation.mutate({ answer });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <h1 className="heading-m">{question?.title}</h1>
      {question?.description && parse(question.description)}
      <div className="divider" />
      <div className="flex flex-col gap-5">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3"
        >
          <RichEditor
            placeholder={t('forum.answerPlaceholder')}
            value={answer}
            onChange={setAnswer}
          />
          <button
            type="submit"
            className="button-primary !px-14 self-end"
            disabled={postAnswerMutation.isLoading}
          >
            {t('forum.done')}
          </button>
        </form>
        {answers && (
        <h1 className="heading-xs">
          {answers?.length}
          {' '}
          {answers?.length === 1 ? 'answer' : 'answers'}
        </h1>
        )}
        {answers?.map((item, index) => (
          <React.Fragment key={item._id}>
            {index > 0 && <div className="divider" />}
            <div
              className="flex flex-col gap-2 p-4 mx-4 rounded-sm hover:bg-secondary"
            >
              {parse(item.answer)}
              <div className="flex items-center gap-3 self-end">
                <UserImage className="w-8 h-8" imageSrc={item.author.image} />
                {item.author.fullName}
                ,
                {' '}
                {formatDate(item.createdAt, i18n)}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </PageWrapper>
  );
}

export default Question;
