import ReactQuill from 'react-quill';
import './RichEditor.css';
import './Snow.css';
import './Bubble.css';
import { useTranslation } from 'react-i18next';

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
];

function RichEditor({
  theme = 'snow',
  placeholder,
  value,
  onChange,
  readOnly = false,
}) {
  const [, i18n] = useTranslation('global');
  return (
    <ReactQuill
      className={i18n.language}
      theme={theme}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
}

export default RichEditor;
