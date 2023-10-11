import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { ZodIssue, ZodSchema } from 'zod';

export default function useForm<T>(initialState: T, validations: ZodSchema<T>) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, ZodIssue | ''>>({});
  const onChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    const validation = validations.safeParse({ ...form, [name]: value });

    if (validation.success) {
      setForm({ ...form, [name]: value });
      setErrors({ ...errors, [name]: '' });
      return;
    }

    const error = JSON.parse(validation.error.message).filter(
      (d: { path: string[] }) => d.path[0] === name
    )[0];

    setErrors({ ...errors, [name]: error || '' });
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm(initialState);
  };

  const validateForm = () => {
    const validation = validations.safeParse(form);
    if (validation.success) {
      return validation;
    }
    const auxErrors = JSON.parse(validation.error.message);
    const newErrors = auxErrors.reduce(
      (acc: Record<string, ZodIssue>, curr: any) => {
        acc[curr.path[0]] = curr;
        return acc;
      },
      {}
    );
    setErrors(newErrors);
    return validation;
  };

  const resetErrors = () => {
    setErrors({});
  };

  return {
    form,
    errors,
    setForm,
    onChange,
    resetForm,
    validateForm,
    resetErrors,
    setErrors,
  };
}
