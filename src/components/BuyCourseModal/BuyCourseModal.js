import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Backdrop from '../Backdrop';
import Field from '../Field';
import Loader from '../Loader';
import Image from '../Image';
import { buyCourse } from '../../utils/coursesApi';
import { getMyInfo, updateMyInfo } from '../../utils/usersApi';
import { correctInputCardNumber, correctInputExpiry } from '../../utils/helpers';
import { cardCvvRegex, cardExpiryRegex, cardNumberRegex } from '../../constants/regex';
import dropIn from '../../constants/dropInAnimation';

function BuyCourseModal({ isOpen, course, handleClose }) {
  const [t] = useTranslation('global');
  const {
    register, formState: { errors }, handleSubmit, getFieldState, setValue,
  } = useForm({ shouldFocusError: false });

  const userId = useSelector((state) => state.auth.userId);
  const { isLoading } = useQuery(`${userId}/info`, getMyInfo, {
    onSuccess: (data) => {
      ['cardNumber', 'cardCvv', 'cardExpiry'].forEach((key) => {
        if (!getFieldState(key).isDirty) {
          setValue(key, data?.user[key], { shouldDirty: true });
        }
      });
    },
  });

  const queryClient = useQueryClient();
  const buyCourseMutation = useMutation(buyCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${userId}/courses/${course._id}`);
      handleClose();
    },
  });

  const updateAccountMutation = useMutation(updateMyInfo, {
    onSuccess: () => {
      buyCourseMutation.mutate(course._id);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    updateAccountMutation.mutate(formData);
  };

  return (
    <AnimatePresence
      initial={false}
      mode="wait"
    >
      {isOpen && (
        <Backdrop onClick={handleClose}>
          <motion.form
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit(onSubmit)}
            className="modal w-[clamp(50vw,500px,90vw)] min-h-[clamp(50vh,500px,90vh)]"
          >
            {isLoading
              ? <Loader />
              : (
                <>
                  <h1 className="heading-m self-start">{t('courses.buy')}</h1>
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-[150px] h-[84px]"><Image imageSrc={course.image} /></div>
                    <div className="flex flex-col">
                      <h1 className="heading-s">{course.name}</h1>
                      <small className="body-text-s">{course.instructors?.join(', ')}</small>
                      <p className="body-text-s text-[#808080]">
                        {course.duration}
                        {' '}
                        {t('courses.hours')}
                      </p>
                      <p className="body-text-s">
                        {t(`courses.${course.level}`)}
                      </p>
                    </div>
                  </div>
                  <Field
                    name={t('card.number')}
                    type="text"
                    error={errors.cardNumber}
                    onKeyDown={correctInputCardNumber}
                    placeholder={t('card.numberPlaceholder')}
                    registerReturn={register('cardNumber', {
                      required: t('emptyFieldError'),
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
                    error={errors.cardCvv}
                    placeholder={t('card.cvvPlaceholder')}
                    registerReturn={register('cardCvv', {
                      required: t('emptyFieldError'),
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
                    error={errors.cardExpiry}
                    placeholder={t('card.expiryPlaceholder')}
                    registerReturn={register('cardExpiry', {
                      required: t('emptyFieldError'),
                      pattern: {
                        value: cardExpiryRegex,
                        message: t('invalidFormatError'),
                      },
                    })}
                  />
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={updateAccountMutation.isLoading || buyCourseMutation.isLoading}
                  >
                    {t('courses.buy')}
                    {' '}
                    {course.price}
                    $
                    {' '}
                  </button>
                </>
              )}
          </motion.form>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

export default BuyCourseModal;
