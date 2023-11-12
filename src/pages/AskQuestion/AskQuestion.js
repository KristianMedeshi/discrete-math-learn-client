import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import Field from '../../components/Field';
import PageWrapper from '../../components/PageWrapper';
import RichEditor from '../../components/RichEditor';
import TagsSelect from '../../components/TagsSelect';
import { createQuestion } from '../../utils/network';

function AskQuestion() {
  const [t] = useTranslation('global');
  const {
    setValue, getValues, control, register, formState: { errors }, handleSubmit,
  } = useForm({
    shouldFocusError: false,
    defaultValues: {
      details: '',
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
    console.log(data);
    createQuestionMutation.mutate(data);
  };

  return (
    <PageWrapper>
      <h1 className="heading-m">{t('forum.yourQuestion')}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <Field
          name={t('forum.title')}
          placeholder={t('forum.titlePlaceholder')}
          error={errors.title}
          registerReturn={register('title', {
            required: t('emptyFieldError'),
          })}
        />
        <div className="flex flex-col gap-1 w-full">
          <small className={`body-text-s ${errors.details ? '!text-red' : ''}`}>
            {t('forum.details')}
            :
          </small>
          <RichEditor
            placeholder={t('forum.detailsPlaceholder')}
            value={() => getValues('details')}
            onChange={(value) => setValue('details', value)}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <small className={`body-text-s ${errors.details ? '!text-red' : ''}`}>
            {t('forum.tags')}
            :
          </small>
          <TagsSelect
            tags={currentTags}
            onSelect={handleSelectTag}
            onRemove={handleRemoveTag}
          />
        </div>
        <button type="submit" className="button-primary !px-14 mt-5 self-end">
          {t('forum.done')}
        </button>
      </form>
    </PageWrapper>
  );
}

export default AskQuestion;
