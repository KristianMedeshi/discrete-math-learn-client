import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa6';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Field from '../../components/Field';
import RichEditor from '../../components/RichEditor';
import Image from '../../components/Image';
import { convertToBase64 } from '../../utils/helpers';
import useDropdown from '../../hooks/useDropdown';
import levels from '../../constants/levels';
import { createCourse } from '../../utils/coursesApi';
import './CreateCourse.scss';
import { emptyEditorRegex, instructorsRegex, numberRegex } from '../../constants/regex';

function CreateCourse() {
  const [t] = useTranslation('global');
  const {
    register, control, formState: { errors }, handleSubmit, getValues, setValue,
  } = useForm({
    shouldFocusError: false,
    defaultValues: {
      level: levels[0],
    },
  });
  const image = useWatch({ name: 'image', control });
  const [imageSrc, setImageSrc] = useState(`${process.env.REACT_APP_BASE_URL}/uploads/1700295692126.jpeg`);
  const {
    isOpen, openDropDown, closeDropDown, dropDownRef, focusTrapRef,
  } = useDropdown();

  useEffect(() => {
    if (image?.[0]) {
      convertToBase64(image[0])
        .then((base64String) => {
          setImageSrc(base64String);
        })
        .catch((error) => {
          console.error('Error converting to base64:', error.name);
        });
    }
  }, [image]);

  const setLevel = (level) => {
    setValue('level', level);
    closeDropDown();
  };

  const navigate = useNavigate();
  const createCourseMutation = useMutation(createCourse, {
    onSuccess: (data) => {
      navigate(`/courses/${data.id}`);
    },
  });

  const onSubmit = (data) => {
    data.instructors = data.instructors.split(',').map((item) => item.trim());
    console.log(data);
    createCourseMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="page-wrapper w-full gap-3"
    >
      <h1 className="heading-m">{t('courses.add')}</h1>
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 w-full">
          <label
            htmlFor="userImage"
            className="flex-center flex-col rounded-md bg-primary
            min-w-[300px] h-[168px] cursor-pointer"
          >
            <input
              id="userImage"
              hidden
              multiple={false}
              type="file"
              accept="image/png, image/jpeg"
              {...register('image')}
            />
            {imageSrc && <Image imageSrc={imageSrc} />}
          </label>
          <div className="flex w-full gap-5">
            <div className="flex flex-col gap-3 w-1/2">
              <Field
                name={t('name')}
                type="text"
                error={errors.name}
                placeholder={t('courses.namePlaceholder')}
                registerReturn={register('name', {
                  required: t('emptyFieldError'),
                })}
              />
              <Field
                name={t('courses.instructors')}
                type="text"
                error={errors.instructors}
                placeholder={t('courses.instructorsPlaceholder')}
                registerReturn={register('instructors', {
                  required: t('emptyFieldError'),
                  pattern: {
                    value: instructorsRegex,
                    message: t('invalidFormatError'),
                  },
                })}
              />
            </div>
            <div className="flex flex-col gap-3 w-1/3">
              <div className="flex justify-between gap-5 w-full">
                <Field
                  name={t('courses.duration')}
                  type="text"
                  style={{ width: '60px' }}
                  inputClassName="text-right"
                  error={errors.duration}
                  placeholder={t('courses.hoursPlaceholder')}
                  registerReturn={register('duration', {
                    required: t('emptyFieldError'),
                    pattern: {
                      value: numberRegex,
                      message: t('invalidFormatError'),
                    },
                  })}
                />
                <Field
                  name={t('courses.price')}
                  type="text"
                  style={{ width: '95px' }}
                  inputClassName="text-right"
                  error={errors.price}
                  placeholder={t('courses.pricePlaceholder')}
                  registerReturn={register('price', {
                    required: t('emptyFieldError'),
                    pattern: {
                      value: numberRegex,
                      message: t('invalidFormatError'),
                    },
                  })}
                  after={<div>$</div>}
                />
              </div>
              <div ref={dropDownRef} className="relative">
                <Field
                  name={t('courses.level')}
                  active={isOpen}
                  onFocus={openDropDown}
                  readOnly
                  registerReturn={{ ...register('level'), value: t(`courses.${getValues('level')}`) }}
                  className="pointer-cursor"
                  after={(
                    <FaChevronDown
                      size={14}
                      className={`${
                        isOpen ? '-rotate-180' : ''
                      } transition-all`}
                    />
                  )}
                />
                <ul
                  ref={focusTrapRef}
                  className={`absolute z-50 flex flex-col w-full bg-primary 
                    rounded-md border border-lines ${isOpen ? '' : 'hidden'}`}
                >
                  {levels.map((level) => (
                    <button
                      type="button"
                      key={level}
                      className="flex gap-1 items-center hover:bg-secondary whitespace-nowrap py-1 px-2"
                      onClick={() => setLevel(level)}
                    >
                      {t(`courses.${level}`)}
                    </button>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <RichEditor
          registerReturn={register('description', {
            required: t('emptyFieldError'),
            pattern: {
              value: emptyEditorRegex,
              message: t('emptyFieldError'),
            },
          })}
          name={t('courses.description')}
          error={errors.description}
          placeholder={t('courses.descriptionPlaceholder')}
          value={() => getValues('description')}
          onChange={(value) => setValue('description', value, {
            shouldValidate: getValues('description'),
          })}
        />
        <div className="divider-x" />
        <button
          type="submit"
          className="button-primary w-fit self-end px-10"
        >
          {t('done')}
        </button>
      </div>
    </form>
  );
}

export default CreateCourse;
