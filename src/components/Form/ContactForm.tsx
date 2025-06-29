import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useZodForm, type FormFieldProps } from '../../lib/forms';

// Define the form schema
const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please enter a valid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    phone: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Form field component
function ContactFormField({ name, label, placeholder, required, type = 'text' }: FormFieldProps<ContactFormData> & { type?: string }) {
    const {
        register,
        formState: { errors },
    } = useFormContext<ContactFormData>();

    const error = errors[name];

    return (
        <div className="form-field">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                {...register(name)}
                id={name}
                type={type}
                placeholder={placeholder}
                className={`form-input ${error ? 'error' : ''}`}
            />
            {error && (
                <span className="form-error">{error.message}</span>
            )}
        </div>
    );
}

// Main contact form component
export function ContactForm() {
    const form = useZodForm(contactFormSchema);

    const onSubmit = (data: ContactFormData) => {
        console.log('Form submitted:', data);
        // Handle form submission
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="contact-form">
            <ContactFormField
                name="name"
                label="Name"
                placeholder="Enter your name"
                required
            />

            <ContactFormField
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
                required
            />

            <ContactFormField
                name="phone"
                label="Phone (optional)"
                placeholder="Enter your phone number"
                type="tel"
            />

            <div className="form-field">
                <label htmlFor="message" className="form-label">
                    Message
                    <span className="required">*</span>
                </label>
                <textarea
                    {...form.register('message')}
                    id="message"
                    placeholder="Enter your message"
                    className={`form-textarea ${form.formState.errors.message ? 'error' : ''}`}
                    rows={4}
                />
                {form.formState.errors.message && (
                    <span className="form-error">{form.formState.errors.message.message}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="form-submit"
            >
                {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
} 