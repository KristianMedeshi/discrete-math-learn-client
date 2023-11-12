const formatDate = (date, i18n) => new Date(date).toLocaleString(i18n.language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: i18n.language === 'en',
});

export default formatDate;
