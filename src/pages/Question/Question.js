import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import parse from 'html-react-parser';
import RichEditor from '../../components/RichEditor';
import PageWrapper from '../../components/PageWrapper';
import Loading from '../Loading';
import { createAnswer, getQuestion } from '../../utils/network';
import formatDate from '../../utils/date';

function Question() {
  const [t, i18n] = useTranslation('global');
  const { questionId } = useParams();
  const { data, isLoading } = useQuery(questionId, () => getQuestion(questionId));
  const { question, answers } = data || {};
  const {
    setValue, getValues, handleSubmit,
  } = useForm({
    shouldFocusError: false,
    defaultValues: {
      answer: '',
    },
  });

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
    <PageWrapper>
      <h1 className="heading-m">{question?.title}</h1>
      {question?.description && parse(question.description)}
      <div className="divider" />
      <div className="flex flex-col gap-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <RichEditor
            placeholder={t('forum.answerPlaceholder')}
            value={() => getValues('answer')}
            onChange={(value) => setValue('answer', value)}
          />
          <button type="submit" className="button-primary !px-14 self-end">
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
        {answers?.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-md bg-secondary"
          >
            {parse(item.answer)}
            <p className="flex justify-between">
              <span>{item.author}</span>
              <span>
                {formatDate(item.createdAt, i18n)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export default Question;
