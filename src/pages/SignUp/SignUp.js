import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import {
  AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible,
} from 'react-icons/ai';
import Field from '../../components/Field';
import { signUp } from '../../utils/network';

function SignUp() {
  const [t] = useTranslation('global');
  const [authError, setAuthError] = useState(' ');
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const { register, formState: { errors }, handleSubmit } = useForm({ shouldFocusError: false });
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const lettersPattern = /[а-яА-Яa-zA-Z]/g;

  const signUpMutation = useMutation(signUp, {
    onError: (error) => {
      if (error.response) {
        setAuthError(error.response.data.error);
      }
    },
  });

  const onSubmit = (data) => {
    signUpMutation.mutate(data);
  };

  return (
    <div className="flex justify-center m-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[500px] flex flex-col gap-4 items-center rounded-[12px] bg-primary
          px-12 py-8 border-lines border"
      >
        <h3 className="heading-m w-full">{t('signUp.title')}</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 w-full">
          <Field
            name={t('firstName')}
            type="text"
            placeholder={t('firstNamePlaceholder')}
            error={errors.firstName}
            registerReturn={register('firstName', {
              required: t('emptyFieldError'),
              pattern: {
                value: lettersPattern,
                message: t('lettersError'),
              },
            })}
          />
          <Field
            name={t('lastName')}
            type="text"
            placeholder={t('lastNamePlaceholder')}
            error={errors.lastName}
            registerReturn={register('lastName', {
              required: t('emptyFieldError'),
              pattern: {
                value: lettersPattern,
                message: t('lettersError'),
              },
            })}
          />
          <Field
            style={{ gridColumn: '-1 / 1' }}
            name={t('email')}
            type="text"
            placeholder={t('emailPlaceholder')}
            icon={<AiOutlineMail />}
            error={errors.email}
            registerReturn={register('email', {
              required: t('emptyFieldError'),
              pattern: {
                value: emailPattern,
                message: t('invalidFormatError'),
              },
            })}
          />
          <Field
            style={{ gridColumn: '-1 / 1' }}
            name={t('password')}
            type={isVisiblePassword ? 'text' : 'password'}
            placeholder={t('passwordPlaceholder')}
            icon={<AiOutlineLock />}
            error={errors.password}
            registerReturn={register('password', {
              required: t('emptyFieldError'),
              minLength: {
                value: 8,
                message: t('passwordLengthError'),
              },
            })}
            after={isVisiblePassword
              ? <AiOutlineEye size={20} onClick={() => setIsVisiblePassword(false)} />
              : <AiOutlineEyeInvisible size={20} onClick={() => setIsVisiblePassword(true)} />}
          />
        </div>
        <p className="w-full body-text-s text-red">{authError}</p>
        <button
          type="submit"
          className="button-primary text-center w-full"
        >
          {t('signUp.title')}
        </button>
        <p>
          {t('signUp.underline')}
          <Link className="text-lightPurple hover:underline" to="/sign-in">{t('signUp.link')}</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
