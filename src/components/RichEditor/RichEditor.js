import ReactQuill from 'react-quill';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { uploadSingle } from '../../utils/network';
import './RichEditor.scss';
import './Snow.scss';

function RichEditor({
  theme = 'snow',
  name,
  placeholder,
  value,
  onChange,
  readOnly = false,
  error,
  className,
}) {
  const quillRef = useRef(null);
  const [valueEditor, setValueEditor] = useState(value);

  const imageHandler = () => {
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
    onChange(valueEditor);
  }, [valueEditor]);

  useEffect(() => {
    if (value !== valueEditor) {
      setValueEditor(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1 w-full rich-editor">
      <small hidden={!name} className={`body-text-s ${error ? '!text-red' : ''}`}>
        {name}
        :
      </small>
      <ReactQuill
        ref={quillRef}
        className={`${error ? 'error' : ''} ${className}`}
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
