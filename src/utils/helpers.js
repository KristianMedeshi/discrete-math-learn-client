import { specSymbolRegex } from '../constants/regex';

const digitRegex = /^\d$/;

export const correctInputCardNumber = (event) => {
  const {
    target, ctrlKey, altKey, shiftKey, metaKey,
  } = event;
  const { key } = event;
  // const { selectionStart, selectionEnd } = target;
  if (specSymbolRegex.test(key) || ctrlKey || altKey || shiftKey || metaKey) {
    return;
  }
  if (digitRegex.test(key) && target.value.replace(!digitRegex, '').length < 19) {
    target.value += key;
    if ([4, 9, 14].includes(target.value.length)) {
      target.value += ' ';
    }
  }
  event.preventDefault();
};

export const correctInputExpiry = (event) => {
  const delimiter = ' / ';
  const maxLength = delimiter.length + 4;
  const { target, key } = event;
  if (specSymbolRegex.test(key)) {
    return;
  }
  event.preventDefault();
  if (!digitRegex.test(key)) {
    return;
  }
  const { value } = target;
  const monthMin = '01';
  const monthMax = '12';
  const yearMin = (new Date()).getFullYear() - 2000;
  const yearMax = (new Date()).getFullYear() - 2000 + 25;

  if (value.length === 0) {
    if (key <= 1) {
      target.value = key;
    } else {
      target.value = `0${key}${delimiter}`;
    }
    return;
  }

  if (value.length === 1) {
    if (value[0] === '0' && key === '0') {
      target.value = `${monthMin}${delimiter}`;
    } else if (value[0] === '1' && key > 2) {
      target.value = `${monthMax}${delimiter}`;
    } else {
      target.value += `${key}${delimiter}`;
    }
  }

  if (value.length === 2 + delimiter.length) {
    target.value = `${target.value}${key}`;
    return;
  }

  if (target.value.length + 1 === maxLength) {
    const [month, year] = target.value.split(delimiter);
    if (month.length !== 2) return;

    if (year + key < yearMin) {
      target.value = `${month}${delimiter}${yearMin}`;
    } else if (year + key > yearMax) {
      target.value = `${month}${delimiter}${yearMax}`;
    } else {
      target.value += key;
    }
  }
};

export const convertToBase64 = (file) => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.onload = () => resolve(fileReader.result);
  fileReader.onerror = (error) => reject(error);
  fileReader.readAsDataURL(file);
});

export const flattenNestedObject = (obj, prefix = '') => (
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (Array.isArray(obj[k])) {
      obj[k].forEach((item, index) => {
        const arrayKey = `${pre}${k}[${index}]`;
        if (typeof item === 'object' && item !== null) {
          Object.assign(acc, flattenNestedObject(item, arrayKey));
        } else {
          acc[arrayKey] = item;
        }
      });
    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flattenNestedObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {})
);
