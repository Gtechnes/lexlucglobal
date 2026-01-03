'use client';

import { useState } from 'react';
import { contactsAPI } from '@/lib/api';
import { Input, Textarea, Button } from '@/components/common/UI';
import { useToast } from '@/lib/hooks';

export default function ContactPage() {
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      await contactsAPI.create(formData);
      success('Message sent successfully! We will get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      showError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-gray-300 mt-2">We'd love to hear from you</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-gray-600">info@lexlucglobal.ng</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className="text-gray-600">+234 XXX XXX XXXX</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="text-gray-600">Lagos, Nigeria</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
              </div>

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  name="company"
                  placeholder="Company (optional)"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                error={errors.subject}
                required
              />

              <Textarea
                name="message"
                placeholder="Your message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                error={errors.message}
                required
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
