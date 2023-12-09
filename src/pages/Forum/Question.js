import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMoreVert } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import EditDeleteModal from '../../components/EditDeleteModal';
import Image from '../../components/Image';
import DeleteModal from '../../components/DeleteModal';
import useModal from '../../hooks/useModal';
import formatDate from '../../utils/date';
import { deleteQuestion } from '../../utils/forumApi';

function Question({ question }) {
  const [t] = useTranslation('global');
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const [tTags, i18n] = useTranslation('tags');
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);
  const [isOpenDeleteModal, openDeleteModal, closeDeleteModal] = useModal();

  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const queryClient = useQueryClient();
  const deleteMutation = useMutation(deleteQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${userId}/questions`);
      closeDeleteModal();
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(question._id);
  };

  return (
    <>
      <div className="relative">
        <Link
          to={`/forum/${question._id}`}
          className="flex flex-col gap-3 p-4 rounded-sm hover:bg-secondary mx-5 relative"
        >
          <h2 className="heading-xs">{question.title}</h2>
          <div className="flex flex-wrap gap-2">
            {question.tags?.map((tag) => (
              <div
                key={tag}
                className="bg-secondary border border-lines
                        px-2 py-1 rounded-sm whitespace-nowrap h-fit"
              >
                {tTags(`${tag}`)}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 self-end">
            <Image className="!w-8 !h-8" imageSrc={question.author.image} />
            {question.author.fullName}
            ,
            {' '}
            {formatDate(question.createdAt, i18n)}
          </div>
          {question.isAuthor && (
            <button
              type="button"
              onClick={handleOpen}
              className="absolute top-[11px] right-[11px] rounded-md p-1
                border border-[transparent] hover:border-lines hover:bg-primary"
            >
              <MdMoreVert
                size={22}
              />
            </button>
          )}
        </Link>
        {question.isAuthor && (
        <EditDeleteModal
          isOpen={modalOpen}
          handleClose={close}
          className="right-3 top-10"
          onEdit={() => navigate(`/forum/edit/${question._id}`)}
          onDelete={openDeleteModal}
        />
        )}
      </div>
      <DeleteModal
        isOpen={isOpenDeleteModal}
        onDelete={handleDelete}
        handleClose={closeDeleteModal}
        deleteHeader={t('forum.deleteQuestionHeader')}
        deleteMessage={t('forum.deleteQuestion')}
      />
    </>
  );
}

export default Question;
