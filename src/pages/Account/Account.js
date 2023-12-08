import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';
import {
  AiOutlineEye, AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import Field from '../../components/Field';
import Image from '../../components/Image';
import Loading from '../Loading';
import { getMyInfo, updateMyInfo } from '../../utils/usersApi';
import {
  cardCvvRegex, cardExpiryRegex, cardNumberRegex, emailRegex, lettersRegex, passwordRegex,
} from '../../constants/regex';
import {
  convertToBase64, correctInputCardNumber, correctInputExpiry,
} from '../../utils/helpers';
import './Account.css';

function Account() {
  const [t] = useTranslation('global');
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const {
    register, formState: { errors }, setValue, getFieldState, handleSubmit, control,
  } = useForm({ shouldFocusError: true });
  const image = useWatch({ name: 'image', control });
  const [imageSrc, setImageSrc] = useState();
  const userId = useSelector((state) => state.auth.userId);
  const { data, isLoading } = useQuery(`${userId}/info`, getMyInfo, {
    onSuccess: (data) => {
      ['email', 'firstName', 'lastName', 'cardNumber', 'cardCvv', 'cardExpiry'].forEach((key) => {
        if (!getFieldState(key).isDirty) {
          setValue(key, data?.user[key], { shouldDirty: true });
        }
      });
      setImageSrc((prev) => prev ?? data?.user?.image);
    },
  });
  const { user } = data ?? {};

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

  const updateAccountMutation = useMutation(updateMyInfo);

  const isObject = (obj) => typeof obj === 'object';
  // eslint-disable-next-line no-unused-vars
  const removeEmpty = (obj) => Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => [k, isObject(v) ? removeEmpty(v) : v])
      .filter(([, v]) => v && (!isObject(v) || Object.keys(v).length > 0)),
  );

  const formEl = useRef(null);
  const onSubmit = (data) => {
    data = removeEmpty(data);
    const formData = new FormData();
    if (typeof data.image === 'string') {
      delete data.image;
    }
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    updateAccountMutation.mutate(formData);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="page-wrapper">
      <form
        ref={formEl}
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
              {...register('image')}
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
                registerReturn={register('firstName', {
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
                registerReturn={register('lastName', {
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
                registerReturn={register('cardNumber', {
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
                registerReturn={register('cardCvv', {
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
                registerReturn={register('cardExpiry', {
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
