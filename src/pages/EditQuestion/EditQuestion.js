import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import Field from '../../components/Field';
import RichEditor from '../../components/RichEditor';
import TagsSelect from '../../components/TagsSelect';
import Loading from '../Loading';
import { getQuestion, updateQuestion } from '../../utils/forumApi';

function EditQuestion() {
  const [t] = useTranslation('global');
  const userId = useSelector((state) => state.auth.userId);
  const {
    setValue, getFieldState, control, register, formState: { errors }, handleSubmit,
  } = useForm({
    shouldFocusError: false,
    defaultValues: {
      tags: [],
    },
  });

  const description = useWatch({ control, name: 'description' });
  const currentTags = useWatch({ control, name: 'tags' });

  const handleSelectTag = (tag) => {
    if (!currentTags.includes(tag) && currentTags.length < 5) {
      const updatedTags = [...currentTags, tag];
      setValue('tags', updatedTags, { shouldDirty: true });
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...currentTags.slice(0, index), ...currentTags.slice(index + 1)];
    setValue('tags', updatedTags, { shouldDirty: true });
  };

  const { questionId } = useParams();
  const { isLoading } = useQuery(`${userId}/${questionId}`, () => getQuestion(questionId), {
    onSuccess: (data) => {
      ['title', 'description', 'tags'].forEach((key) => {
        if (!getFieldState(key).isDirty) {
          setValue(key, data?.question[key]);
          setValue(key, data?.question[key]);
        }
      });
    },
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateQuestionMutation = useMutation((data) => updateQuestion(questionId, data), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([`${userId}/questions`, `${userId}/${questionId}`]);
      navigate(`/forum/${data.id}`);
    },
  });

  const onSubmit = (data) => {
    updateQuestionMutation.mutate(data);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form
      className="page-wrapper"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="heading-m">{t('edit')}</h1>
      <Field
        name={t('title')}
        placeholder={t('forum.titlePlaceholder')}
        error={errors.title}
        registerReturn={register('title', {
          required: t('emptyFieldError'),
        })}
      />
      <RichEditor
        name={t('forum.description')}
        placeholder={t('forum.descriptionPlaceholder')}
        value={description}
        onChange={(value) => setValue('description', value)}
      />
      <div className="flex flex-col gap-1 w-full">
        <small className={`body-text-s ${errors.tags ? '!text-red' : ''}`}>
          {t('forum.tags')}
          :
        </small>
        <TagsSelect
          tags={currentTags}
          onSelect={handleSelectTag}
          onRemove={handleRemoveTag}
        />
      </div>
      <div className="divider-x mt-5" />
      <button type="submit" className="button-primary !px-14 self-end">
        {t('save')}
      </button>
    </form>
  );
}

export default EditQuestion;
