import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import { useMutation } from 'react-query';
import Field from '../../components/Field';
import RichEditor from '../../components/RichEditor';
import { createCourseChapter } from '../../utils/coursesApi';
import './AddCourseChapter.scss';

function AddCourseChapter() {
  const [t] = useTranslation('global');
  const { id } = useParams();

  const {
    register, formState: { errors }, control, handleSubmit, getValues, setValue,
  } = useForm({
    defaultValues: {
      tasks: [],
      tests: [],
    },
  });

  const {
    fields: tasksFields, append: appendTask, remove: removeTask,
  } = useFieldArray({
    control,
    name: 'tasks',
  });

  const {
    fields: testsFields, append: appendTest, remove: removeTest,
  } = useFieldArray({
    control,
    name: 'tests',
  });

  const handleAppendTask = () => {
    appendTask({ title: '', answer: '' }, { shouldFocus: false });
  };

  const handleAppendTest = () => {
    appendTest({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }, { shouldFocus: false });
  };

  const navigate = useNavigate();
  const createCourseChapterMutation = useMutation(async (data) => createCourseChapter(id, data), {
    onSuccess: (data) => {
      navigate(`/courses/${id}?block=${data.id}`);
    },
  });

  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const handleAttachmentAdd = (event) => {
    const { files } = event.target;
    setSelectedAttachments((prevFiles) => [...prevFiles, ...files]);
  };

  const handleAttachmentRemove = (fileToRemove) => {
    setSelectedAttachments((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('jsonData', JSON.stringify(data));
    selectedAttachments.forEach((file) => {
      formData.append('attachments', file);
    });
    createCourseChapterMutation.mutate(formData);
  };

  return (
    <form
      className="page-wrapper w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        name={t('title')}
        placeholder={t('courses.chapterTitlePlaceholder')}
        error={errors.title}
        registerReturn={register('title', {
          required: t('emptyFieldError'),
        })}
      />
      <RichEditor
        name={t('courses.lecture')}
        placeholder={t('courses.lecturePlaceholder')}
        error={errors.lecture}
        registerReturn={register('lecture', {
          required: t('emptyFieldError'),
        })}
        value={() => getValues('lecture')}
        onChange={(value) => setValue('lecture', value, {
          shouldValidate: getValues('lecture'),
        })}
      />
      <div className="divider-x" />
      <div className="flex flex-col gap-1 w-full">
        <small className="body-text-s">
          {t('courses.tasks')}
          :
        </small>
        <div className="flex flex-col gap-3">
          {tasksFields.map((task, index) => (
            <div
              className="bg-secondary p-5 rounded-md relative"
              key={`${JSON.stringify(task)}${index}`}
            >
              <AiOutlineClose
                className="icon-close"
                size={20}
                onClick={() => removeTask(index)}
              />
              <RichEditor
                name={t('title')}
                className="editor"
                error={errors.tasks?.[index]?.title}
                registerReturn={register(`tasks.${index}.title`)}
                value={() => getValues(`tasks.${index}.title`)}
                onChange={(value) => setValue(`tasks.${index}.title`, value)}
              />
              <Field
                name={t('answer')}
                error={errors.tests?.[index]?.answer}
                registerReturn={register(`tasks.${index}.answer`)}
              />
            </div>
          ))}
          <button
            type="button"
            className="button-primary w-fit self-end px-5"
            onClick={handleAppendTask}
          >
            {t('courses.addTask')}
          </button>
        </div>
      </div>
      <div className="divider-x" />
      <div className="flex flex-col gap-1 w-full">
        <small className="body-text-s">
          {t('courses.tests')}
          :
        </small>
        <div className="flex flex-col gap-3">
          {testsFields.map((test, index) => (
            <div
              className="bg-secondary p-5 rounded-md relative"
              key={`${JSON.stringify(test)}${index}`}
            >
              <AiOutlineClose
                className="icon-close"
                size={20}
                onClick={() => removeTest(index)}
              />
              <RichEditor
                name={t('courses.question')}
                className="editor"
                error={errors.tests?.[index]?.questionText}
                registerReturn={register(`tests.${index}.questionText`)}
                value={() => getValues(`tests.${index}.questionText`)}
                onChange={(value) => setValue(`tests.${index}.questionText`, value)}
              />
              <Field
                icon={1}
                error={errors.tests?.[index]?.options?.[0]}
                registerReturn={register(`tests.${index}.options.0`)}
              />
              <Field
                icon={2}
                error={errors.tests?.[index]?.options?.[1]}
                registerReturn={register(`tests.${index}.options.1`)}
              />
              <Field
                icon={3}
                error={errors.tests?.[index]?.options?.[2]}
                registerReturn={register(`tests.${index}.options.2`)}
              />
              <Field
                icon={4}
                error={errors.tests?.[index]?.options?.[3]}
                registerReturn={register(`tests.${index}.options.3`)}
              />
              <Field
                name={t('courses.correctIndexOption')}
                error={errors.tests?.[index]?.answer}
                registerReturn={register(`tests.${index}.correctIndexOption`)}
              />
            </div>
          ))}
          <button
            type="button"
            className="button-primary w-fit self-end px-5"
            onClick={handleAppendTest}
          >
            {t('courses.addTest')}
          </button>
        </div>
      </div>
      <div className="divider-x" />
      <div className="flex flex-col gap-1 w-full">
        <small className="body-text-s">
          Attachments:
        </small>
        <div className="flex gap-3 flex-wrap">
          {selectedAttachments.map((attachment) => (
            <button
              type="button"
              className="flex gap-1 items-center bg-secondary border border-lines
              whitespace-nowrap py-1 px-2 rounded-sm w-fit"
              onClick={() => handleAttachmentRemove(attachment)}
            >
              {attachment.name}
              <AiOutlineClose />
            </button>
          ))}
        </div>
        <label
          htmlFor="attachmentsInput"
          className="button-primary w-fit px-8 cursor-pointer self-end"
        >
          <input
            id="attachmentsInput"
            type="file"
            hidden
            onChange={handleAttachmentAdd}
          />
          {t('courses.attachFile')}
        </label>
      </div>
      <div className="divider-x" />
      <button
        type="submit"
        className="button-primary w-fit self-end px-10"
      >
        {t('done')}
      </button>
    </form>
  );
}

export default AddCourseChapter;
