import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import Field from '../../components/Field';
import RichEditor from '../../components/RichEditor';
import TagsSelect from '../../components/TagsSelect';
import { createQuestion } from '../../utils/forumApi';

function AskQuestion() {
  const [t] = useTranslation('global');
  const {
    setValue, getValues, control, register, formState: { errors }, handleSubmit,
  } = useForm({
    shouldFocusError: false,
    defaultValues: {
      tags: [],
    },
  });

  const currentTags = useWatch({ control, name: 'tags' });

  const handleSelectTag = (tag) => {
    if (!currentTags.includes(tag) && currentTags.length < 5) {
      const updatedTags = [...currentTags, tag];
      setValue('tags', updatedTags);
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...currentTags.slice(0, index), ...currentTags.slice(index + 1)];
    setValue('tags', updatedTags);
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createQuestionMutation = useMutation(createQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries('questions');
      navigate('/forum');
    },
  });

  const onSubmit = (data) => {
    createQuestionMutation.mutate(data);
  };

  return (
    <form
      className="page-wrapper"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="heading-m">{t('forum.yourQuestion')}</h1>
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
        value={() => getValues('description')}
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
        {t('done')}
      </button>
    </form>
  );
}

export default AskQuestion;
