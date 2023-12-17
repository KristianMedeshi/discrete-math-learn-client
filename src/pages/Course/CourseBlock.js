import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Field from '../../components/Field';
import { getCourseBlock, markAsCompleted } from '../../utils/coursesApi';
import Loader from '../../components/Loader';

function CourseBlock({ id }) {
  const [t] = useTranslation('global');
  const courseId = useParams().id;
  const userId = useSelector((state) => state.auth.userId);
  const { data, isLoading } = useQuery(`${userId}/${courseId}/${id}`, () => getCourseBlock(courseId, id));
  const { block } = data || {};
  const [message, setMessage] = useState('');

  const { register, control, handleSubmit } = useForm({ shouldFocusError: false });

  const queryClient = useQueryClient();
  const markCourseMutation = useMutation((data) => markAsCompleted(block._id, data), {
    onSuccess: (data) => {
      setMessage(data?.message);
      queryClient.invalidateQueries(`${userId}/courses/${courseId}`);
    },
  });

  const onSubmit = (data) => {
    markCourseMutation.mutate(data);
  };

  useEffect(() => {
    setMessage('');
  }, [id]);

  if (isLoading) {
    return <div className="flex w-full h-full items-center justify-center"><Loader /></div>;
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ReactQuill
        value={block?.lecture}
        readOnly
        modules={{ toolbar: false }}
      />
      <div className="divider-x" hidden={!block?.attachments.length} />
      {block?.attachments.map((file) => (
        <a
          target="_black"
          href={file.path}
          rel="noreferrer"
          key={file.path}
          className="bg-secondary border border-lines
          px-2 py-1 rounded-sm whitespace-nowrap h-fit w-fit hover:underline"
        >
          {file.originalName}
        </a>
      ))}
      <div className="divider-x" hidden={!block?.tests.length} />
      {block?.tests.map((test, index) => (
        <div
          key={test.questionText}
          className="bg-secondary p-4 rounded-md"
        >
          <ReactQuill
            value={test?.questionText}
            readOnly
            modules={{ toolbar: false }}
          />
          <Controller
            name={`answersTests.${index}`}
            control={control}
            defaultValue=""
            rules={{ required: t('emptyFieldError') }}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                {test.options.map((option, indexInner) => (
                  <label
                    key={option}
                    htmlFor={`${index}/${indexInner}`}
                    className="flex gap-3 items-center hover:bg-primary
                      px-3 py-3 rounded-md cursor-pointer"
                  >
                    <input
                      id={`${index}/${indexInner}`}
                      type="radio"
                      {...field}
                      value={option}
                      className="test-radio"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          />
        </div>
      ))}
      <div className="divider-x" hidden={!block?.tasks.length} />
      {block?.tasks.map((task, index) => (
        <div
          key={task}
          className="bg-secondary p-4 rounded-md"
        >
          <ReactQuill
            value={task?.title}
            readOnly
            modules={{ toolbar: false }}
          />
          <Field registerReturn={register(`answersTasks.${index}`)} />
        </div>
      ))}
      <div className="divider-x" hidden={block.isPassed} />
      <button
        type="submit"
        hidden={block.isPassed}
        className="button-primary w-fit self-end px-5"
        disabled={markCourseMutation.isLoading}
      >
        {t('courses.markAsCompleted')}
      </button>
      <p>{message}</p>
    </form>
  );
}

export default CourseBlock;
