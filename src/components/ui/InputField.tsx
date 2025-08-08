import React from 'react';
import { UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<TFieldValues extends FieldValues> {
  id: Path<TFieldValues>;
  label: string;
  register: UseFormRegister<TFieldValues>;
  error?: FieldErrors<TFieldValues>;
  type?: string;
  className?: string;
}

const InputField = <TFieldValues extends FieldValues>({ id, label, register, error, type = 'text', className = 'w-full p-2 border rounded' }: InputFieldProps<TFieldValues>) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-1">{label}</label>
      <input id={id} {...register(id)} type={type} className={className} />
      {typeof error?.[id]?.message === 'string' && (
        <p className="text-red-500 mt-1">{error?.[id]?.message}</p>
      )}
    </div>
  );
};

export default InputField;
