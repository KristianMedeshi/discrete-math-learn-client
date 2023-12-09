import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { MdMoreVert } from 'react-icons/md';
import RichEditor from '../../components/RichEditor';
import Image from '../../components/Image';
import EditDeleteModal from '../../components/EditDeleteModal';
import useModal from '../../hooks/useModal';
import Loading from '../Loading';
import { createAnswer, deleteQuestion, getQuestion } from '../../utils/forumApi';
import formatDate from '../../utils/date';
import { emptyEditorRegex } from '../../constants/regex';
import DeleteModal from '../../components/DeleteModal';

function Question() {
  const [t, i18n] = useTranslation('global');
  const { questionId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useModal();
  const userId = useSelector((state) => state.auth.userId);
  const { data, isLoading } = useQuery(`${userId}/${questionId}`, () => getQuestion(questionId));
  const { question, answers } = data || {};
  const {
    register, formState: { errors }, handleSubmit, setValue, control,
  } = useForm({ shouldFocusError: false });
  const answer = useWatch({ control, name: 'answer' });

  const queryClient = useQueryClient();
  const postAnswerMutation = useMutation(async (postData) => {
    await createAnswer(questionId, postData);
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${userId}/${questionId}`);
    },
  });
  const navigate = useNavigate();
  const deleteMutation = useMutation(deleteQuestion, {
    onSuccess: () => {
      closeDeleteModal();
      queryClient.invalidateQueries(`${userId}/questions`);
      navigate('/forum');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(question._id);
  };
  const onSubmit = (data) => {
    postAnswerMutation.mutate(data);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="page-wrapper relative">
        <h1 className="heading-m">{question?.title}</h1>
        {question.isAuthor && (
        <button
          type="button"
          onClick={handleOpen}
          className="absolute top-[31px] right-[31px] rounded-md p-1
                border border-[transparent] hover:border-lines hover:bg-primary"
        >
          <MdMoreVert
            size={25}
          />
        </button>
        )}
        {question.isAuthor && (
        <EditDeleteModal
          isOpen={modalOpen}
          handleClose={close}
          className="right-5 top-16"
          onEdit={() => navigate(`/forum/edit/${question._id}`)}
          onDelete={openDeleteModal}
        />
        )}
        {question?.description && (
        <ReactQuill
          value={question.description}
          readOnly
          modules={{ toolbar: false }}
        />
        )}
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
              value={answer}
              onChange={(value) => setValue('answer', value, {
                shouldValidate: answer,
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
                <ReactQuill
                  value={item.answer}
                  readOnly
                  modules={{ toolbar: false }}
                />
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
      <DeleteModal
        isOpen={isOpenDeleteModal}
        onDelete={handleDelete}
        handleClose={closeDeleteModal}
        deleteHeader={t('forum.deleteQuestionHeader')}
        deleteMessage={t('forum.deleteQuestion')}
      />
    </>
  );
}

export default Question;
