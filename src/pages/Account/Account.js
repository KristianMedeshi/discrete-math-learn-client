import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import {
  AiOutlineEye, AiOutlineEyeInvisible,
} from 'react-icons/ai';
import Field from '../../components/Field';
import Image from '../../components/Image';
import Loading from '../Loading';
import { getMyInfo, updateMyInfo } from '../../utils/usersApi';
import './Account.css';
import {
  cardCvvRegex, cardExpiryRegex, cardNumberRegex, emailRegex, lettersRegex, passwordRegex,
} from '../../constants/regex';
import {
  convertToBase64, correctInputCardNumber, correctInputExpiry,
} from '../../utils/helpers';

function Account() {
  const [t] = useTranslation('global');
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const {
    register, formState: { errors }, reset, handleSubmit, control,
  } = useForm({ shouldFocusError: true });
  const newImage = useWatch({ name: 'newImage', control });
  const [imageSrc, setImageSrc] = useState();
  const { data, isLoading } = useQuery('info', getMyInfo, {
    onSuccess: (data) => {
      reset(data?.user, { keepDirtyValues: true });
      setImageSrc((prev) => prev ?? data?.user?.image);
    },
  });
  const { user } = data ?? {};

  useEffect(() => {
    if (newImage?.[0]) {
      convertToBase64(newImage[0])
        .then((base64String) => {
          setImageSrc(base64String);
        })
        .catch((error) => {
          console.error('Error converting to base64:', error.name);
        });
    }
  }, [newImage]);

  const updateAccountMutation = useMutation(updateMyInfo);

  const isObject = (obj) => typeof obj === 'object';
  const removeEmpty = (obj) => Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => [k, isObject(v) ? removeEmpty(v) : v])
      .filter(([, v]) => v && (!isObject(v) || Object.keys(v).length > 0)),
  );

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('newImage', data?.newImage?.[0]);
    data = removeEmpty(data);
    formData.append('jsonData', JSON.stringify(data));
    updateAccountMutation.mutate(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10 w-full"
      >
        <div className="flex gap-10">
          <label
            htmlFor="userImage"
            className="flex-center flex-col rounded-md bg-primary
            w-[220px] h-[220px] cursor-pointer"
          >
            <input
              id="userImage"
              hidden
              multiple={false}
              type="file"
              accept="image/png, image/jpeg"
              {...register('newImage')}
            />
            {imageSrc && <Image imageSrc={imageSrc} />}
          </label>
          <div className="flex flex-col">
            <h1 className="heading-m">{user?.fullName}</h1>
            <h2 className="body-text-m">{user?.email}</h2>
          </div>
        </div>
        <div className="flex w-full gap-5 justify-between">
          <div className="form-column">
            <h3 className="heading-s">{t('personal')}</h3>
            <div>
              <Field
                name={t('firstName')}
                type="text"
                placeholder={t('firstNamePlaceholder')}
                error={errors.name?.first}
                registerReturn={register('name.first', {
                  required: t('emptyFieldError'),
                  pattern: {
                    value: lettersRegex,
                    message: t('lettersError'),
                  },
                })}
              />
              <Field
                name={t('lastName')}
                type="text"
                placeholder={t('lastNamePlaceholder')}
                error={errors.name?.last}
                registerReturn={register('name.last', {
                  required: t('emptyFieldError'),
                  pattern: {
                    value: lettersRegex,
                    message: t('lettersError'),
                  },
                })}
              />
              <Field
                name={t('email')}
                type="text"
                placeholder={t('emailPlaceholder')}
                error={errors.email}
                registerReturn={register('email', {
                  required: t('emptyFieldError'),
                  pattern: {
                    value: emailRegex,
                    message: t('invalidFormatError'),
                  },
                })}
              />
            </div>
          </div>
          <div className="form-column">
            <h3 className="heading-s">{t('password')}</h3>
            <div>
              <Field
                name={t('currentPassword')}
                type={isVisiblePassword ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder')}
                error={errors.currentPassword}
                registerReturn={register('currentPassword', {
                  pattern: {
                    value: passwordRegex,
                    message: t('passwordError'),
                  },
                })}
                after={isVisiblePassword
                  ? <AiOutlineEye size={20} onClick={() => setIsVisiblePassword(false)} className="cursor-pointer" />
                  : <AiOutlineEyeInvisible size={20} onClick={() => setIsVisiblePassword(true)} className="cursor-pointer" />}
              />
              <Field
                name={t('newPassword')}
                type={isVisiblePassword ? 'text' : 'password'}
                placeholder={t('newPasswordPlaceholder')}
                error={errors.newPassword}
                registerReturn={register('newPassword', {
                  pattern: {
                    value: passwordRegex,
                    message: t('passwordError'),
                  },
                })}
              />
            </div>
          </div>
          <div className="form-column">
            <h3 className="heading-s">{t('card.card')}</h3>
            <div>
              <Field
                name={t('card.number')}
                type="text"
                error={errors.card?.number}
                onKeyDown={correctInputCardNumber}
                placeholder={t('card.numberPlaceholder')}
                registerReturn={register('card.number', {
                  pattern: {
                    value: cardNumberRegex,
                    message: t('invalidFormatError'),
                  },
                })}
                maxLength={19}
              />
              <Field
                name={t('card.cvv')}
                type="text"
                error={errors.card?.cvv}
                placeholder={t('card.cvvPlaceholder')}
                registerReturn={register('card.cvv', {
                  pattern: {
                    value: cardCvvRegex,
                    message: t('invalidFormatError'),
                  },
                })}
                maxLength={4}
              />
              <Field
                name={t('card.expiry')}
                type="text"
                onKeyDown={correctInputExpiry}
                error={errors.card?.expiry}
                placeholder={t('card.expiryPlaceholder')}
                registerReturn={register('card.expiry', {
                  pattern: {
                    value: cardExpiryRegex,
                    message: t('invalidFormatError'),
                  },
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="divider-x my-4" />
          <button
            type="submit"
            className="button-primary px-12 self-end"
            disabled={isLoading || updateAccountMutation.isLoading}
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Account;
