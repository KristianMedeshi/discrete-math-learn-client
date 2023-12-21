function Field({
  id,
  style,
  inputClassName,
  name,
  type,
  placeholder,
  error,
  icon,
  registerReturn,
  after,
  onKeyDown,
  maxLength,
  onFocus,
  readOnly,
  active,
  className,
}) {
  return (
    <div className="flex flex-col gap-1 w-full" style={style}>
      <small className={`body-text-s ${error ? '!text-red' : ''} whitespace-nowrap`}>
        {name}
        {name && ':'}
      </small>
      <label
        htmlFor={id ?? name}
        className={`label-borders flex gap-[12px] items-center bg-primary
          ${error ? 'outline-red outline-2' : ''} 
          ${active ? 'active-focus' : ''}
          ${className}`}
      >
        {icon}
        <input
          id={id ?? name}
          type={type}
          className={`w-full ${inputClassName}`}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          maxLength={maxLength}
          placeholder={placeholder}
          {...registerReturn}
          readOnly={readOnly}
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
