/* eslint-disable react/jsx-props-no-spreading */
function Field({
  style,
  name,
  type,
  placeholder,
  error,
  icon,
  registerReturn,
  after,
}) {
  return (
    <div className="flex flex-col gap-1 w-full" style={style}>
      <small className={`body-text-s ${error ? '!text-red' : ''}`}>
        {name}
        :
      </small>
      <label
        htmlFor={name}
        className={`label-borders flex gap-[12px] items-center ${
          error ? 'border-red border-2 p-[9px]' : ''
        }`}
      >
        {icon}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...registerReturn}
        />
        <div className="ml-auto">{after}</div>
      </label>
      <span className="body-text-s !text-red h-[8px]">
        {error?.message}
        {' '}
      </span>
    </div>
  );
}

export default Field;
