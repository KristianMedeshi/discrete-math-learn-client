/* eslint-disable no-unused-vars */
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';
import { useMemo, useRef } from 'react';
import { uploadSingle } from '../../utils/network';
import './RichEditor.css';
import './Snow.css';
import './Bubble.css';

function RichEditor({
  theme = 'snow',
  placeholder,
  value,
  onChange,
  readOnly = false,
}) {
  const quillRef = useRef(null);
  const [, i18n] = useTranslation('global');

  const imageHandler = () => {
    console.log('handles image');
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const res = await uploadSingle(file, quillRef);
      const range = quillRef.current.getEditorSelection();
      quillRef.current.getEditor().insertEmbed(range.index, 'image', res.path);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          // [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
          [{ direction: 'rtl' }],
          // [{ size: ['small', false, 'large', 'huge'] }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
        history: {
          delay: 500,
          maxStack: 100,
          userOnly: true,
        },
      },
    }),
    [],
  );

  return (
    <ReactQuill
      ref={quillRef}
      className={i18n.language}
      theme={theme}
      placeholder={placeholder}
      modules={modules}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
}

export default RichEditor;
