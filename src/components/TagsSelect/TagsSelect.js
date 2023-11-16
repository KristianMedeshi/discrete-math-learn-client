import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import useDropdown from '../../hooks/useDropdown';
import validTags from '../../constants/tags';
import './TagsSelect.css';

function TagsSelect({ tags, onSelect, onRemove }) {
  const [tGlobal, i18n] = useTranslation('global');
  const [tTags] = useTranslation('tags');
  const {
    inputRef, focusTrapRef, dropDownRef, isOpen, openDropDown,
  } = useDropdown();
  const [filteredTags, setFilteredTags] = useState(validTags[i18n.language]);
  const handleInputChange = (event) => {
    const { value } = event.target;
    const filtered = [];
    console.log(i18n.language);
    validTags[i18n.language].forEach((item) => {
      if (item.key.toLowerCase().includes(value.toLowerCase())) {
        filtered.push(item);
      }
    });
    setFilteredTags(filtered);
  };

  return (
    <div
      ref={(node) => {
        focusTrapRef.current = node;
        dropDownRef.current = node;
      }}
      className={`relative ${isOpen ? 'mb-32' : ''}`}
    >
      <label
        htmlFor="tags"
        className="label-borders flex gap-[12px] items-center overflow-x-scroll tagsLabel"
      >
        {tags?.map((tag, index) => (
          <button
            type="button"
            key={tag}
            className="flex gap-1 items-center bg-lines
              whitespace-nowrap py-1 px-2 rounded-sm"
            onClick={() => onRemove(index)}
          >
            {tTags(tag)}
            <AiOutlineClose />
          </button>
        ))}
        <input
          ref={inputRef}
          id="tags"
          type="text"
          onFocus={openDropDown}
          onChange={handleInputChange}
          placeholder={tGlobal('forum.tagsMessage')}
          hidden={tags?.length >= 5}
        />
      </label>
      <ul
        className={`absolute z-50 flex flex-col w-full bg-primary translate-y-2
          rounded-md border border-lines max-h-[200px] overflow-y-scroll ${isOpen ? '' : 'hidden'}`}
      >
        {filteredTags?.map((tag) => (
          <button
            type="button"
            key={tag.key}
            onClick={() => {
              onSelect(tag.value);
              openDropDown();
            }}
            className="text-left p-2 hover:bg-lines"
          >
            {tTags(`${tag.key}`)}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default TagsSelect;
