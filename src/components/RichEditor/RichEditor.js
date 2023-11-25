import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { uploadSingle } from '../../utils/network';
import './RichEditor.scss';
import './Snow.scss';
import './Bubble.scss';

function RichEditor({
  theme = 'snow',
  name,
  placeholder,
  value,
  onChange,
  readOnly = false,
  error,
}) {
  const quillRef = useRef(null);
  const [, i18n] = useTranslation('global');
  const [valueEditor, setValueEditor] = useState(value);

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

  useEffect(() => {
    console.log('editor', valueEditor);
    onChange(valueEditor);
  }, [valueEditor]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <small hidden={!name} className={`body-text-s ${error ? '!text-red' : ''}`}>
        {name}
        :
      </small>
      <ReactQuill
        ref={quillRef}
        className={`${i18n.language} ${error ? 'error' : ''}`}
        theme={theme}
        placeholder={placeholder}
        modules={modules}
        value={valueEditor}
        onChange={setValueEditor}
        readOnly={readOnly}
      />
      <span className="body-text-s !text-red h-[8px] whitespace-nowrap">
        {error?.message}
        {' '}
      </span>
    </div>
  );
}

export default RichEditor;
