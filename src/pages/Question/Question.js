import React from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';
import { useForm } from 'react-hook-form';
import RichEditor from '../../components/RichEditor';
import Image from '../../components/Image';
import Loading from '../Loading';
import { createAnswer, getQuestion } from '../../utils/forumApi';
import formatDate from '../../utils/date';
import { emptyEditorRegex } from '../../constants/regex';

function Question() {
  const [t, i18n] = useTranslation('global');
  const { questionId } = useParams();
  const { data, isLoading } = useQuery(questionId, () => getQuestion(questionId));
  const { question, answers } = data || {};
  const {
    register, formState: { errors }, handleSubmit, getValues, setValue,
  } = useForm({ shouldFocusError: false });

  const queryClient = useQueryClient();
  const postAnswerMutation = useMutation(async (postData) => {
    await createAnswer(questionId, postData);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(questionId);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    postAnswerMutation.mutate(data);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper">
      <h1 className="heading-m">{question?.title}</h1>
      {question?.description && parse(question.description)}
      <div className="divider-x" />
      <div className="flex flex-col gap-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <RichEditor
            {...register('answer', {
              required: t('emptyFieldError'),
              pattern: {
                value: emptyEditorRegex,
                message: t('emptyFieldError'),
              },
            })}
            name={undefined}
            error={errors.answer}
            placeholder={t('forum.answerPlaceholder')}
            value={() => getValues('answer')}
            onChange={(value) => setValue('answer', value, {
              shouldValidate: getValues('answer'),
            })}
          />
          <button
            type="submit"
            className="button-primary !px-14 self-end"
            disabled={postAnswerMutation.isLoading}
          >
            {t('done')}
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
            {index > 0 && <div className="divider-x" />}
            <div
              className="flex flex-col gap-2 p-4 mx-4 rounded-sm hover:bg-secondary"
            >
              {parse(item.answer)}
              <div className="flex items-center gap-3 self-end">
                <Image className="!w-8 !h-8" imageSrc={item.author.image} />
                {item.author.fullName}
                ,
                {' '}
                {formatDate(item.createdAt, i18n)}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Question;
