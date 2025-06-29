import { useForm, type UseFormReturn, type FieldValues, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Common form configuration
export const formConfig = {
  mode: 'onChange' as const,
  reValidateMode: 'onChange' as const,
};

// Type-safe form hook with Zod schema
export function useTypedForm<T extends FieldValues>(
  config?: Parameters<typeof useForm<T>>[0]
): UseFormReturn<T> {
  return useForm<T>({
    ...formConfig,
    ...config,
  });
}

// Type-safe form hook with Zod validation
export function useZodForm<T extends z.ZodType<any, any, any>>(
  schema: T,
  config?: Omit<Parameters<typeof useForm<z.infer<T>>>[0], 'resolver'>
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    ...formConfig,
    resolver: zodResolver(schema),
    ...config,
  });
}

// Common form field props type
export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

// Form validation error type
export interface FormError {
  type: string;
  message: string;
}

// Common form submission handler type
export type FormSubmitHandler<T> = (data: T) => void | Promise<void>;

// Common Zod schemas for reuse
export const commonSchemas = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  required: z.string().min(1, 'This field is required'),
  optional: z.string().optional(),
  number: z.number().min(0, 'Must be a positive number'),
  url: z.string().url('Please enter a valid URL'),
} as const; 