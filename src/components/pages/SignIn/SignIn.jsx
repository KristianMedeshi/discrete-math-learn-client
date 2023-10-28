import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible,
} from 'react-icons/ai';
import InputWrapper from '../../ui/Input/Input';
import { signIn } from '../../../utils/network';

function SignIn() {
  const [t] = useTranslation('global');
  const [authError, setAuthError] = useState(' ');
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const { register, formState: { errors }, handleSubmit } = useForm({ shouldFocusError: false });
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const onSubmit = (data) => {
    console.log(data);
    signIn(data).then((response) => {
      console.log(response);
      localStorage.setItem('token', response.data.token);
    }).catch((error) => {
      setAuthError(error.response.data.error);
    });
  };

  return (
    <div className="flex justify-center m-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[500px] flex flex-col gap-4 items-center rounded-[12px] bg-primary
          px-12 py-8 border-lines border-2"
      >
        <h3 className="heading-m w-full">{t('signIn.title')}</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 w-full">
          <InputWrapper
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
          <InputWrapper
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
          className="button-primary w-full "
        >
          {t('signIn.title')}
        </button>
        <p>
          {t('signIn.underline')}
          <Link className="text-lightPurple" to="/sign-up">{t('signIn.link')}</Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
