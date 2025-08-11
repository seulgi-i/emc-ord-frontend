import React, { useEffect } from 'react';
import { useFormContext, FieldValues, Path, RegisterOptions, PathValue, useController, Control } from 'react-hook-form';

type InputType = 'text' | 'tel' | 'number' | 'password' | 'email' | 'amt';

interface InputFieldProps<TFieldValues extends FieldValues> {
  id: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>
  type?: InputType;
  className?: string;
  inputProps?: RegisterOptions<TFieldValues, Path<TFieldValues>>; 
}

const InputField = <TFieldValues extends FieldValues>({
  id,
  label,
  control,
  type = 'text',
  className = 'w-full p-2 border rounded',
  inputProps = {}
}: InputFieldProps<TFieldValues>) => {
  const { field, fieldState: { error } } = useController({ name: id, control });

  const fieldError = error;

  const getMaxLengthValue = () => {
    const maxLength = inputProps.maxLength;
    if (typeof maxLength === 'number') {
      return maxLength;
    }
    if (typeof maxLength === 'object' && maxLength.value) {
      return maxLength.value;
    }
    return undefined;
  };

  const maxLengthValue = getMaxLengthValue();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (type === 'tel' || type === 'number') {
      value = value.replace(/\D/g, '');
      if (typeof maxLengthValue === 'number' && value.length > maxLengthValue) {
        value = value.slice(0, maxLengthValue);
      }
    } else if (type === 'amt') {
      value = value.replace(/\D/g, '');
      if (value === "") {
        e.target.value = '0';
      } else {
        e.target.value = new Intl.NumberFormat('en-US').format(Number(value));
      }
    }
    e.target.value = value;
    field.onChange(value);
  };

  // form 변경 확인
  useEffect(() => {
    console.log("field", field)
  }, [field]);

  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
      <input
        id={id}
        type={type}
        className={className}
        onChange={handleOnChange}
      />
      {typeof fieldError?.message === 'string' && (
        <p className="text-red-500 text-sm mt-1">{fieldError.message}</p>
      )}
    </div>
  );
};

export default InputField;