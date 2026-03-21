"use client";

import { useState } from "react";
function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error = "",
  darkMode = false,
}) {
  const baseClasses = `w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none ${
    darkMode
      ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 ${
          error ? "border-red-500" : ""
        }`
      : `bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 ${
          error ? "border-red-500" : ""
        }`
  }`;

  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={baseClasses}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
function Select({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Select an option",
  required = false,
  error = "",
  darkMode = false,
}) {
  const baseClasses = `w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none appearance-none cursor-pointer ${
    darkMode
      ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 ${
          error ? "border-red-500" : ""
        }`
      : `bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 ${
          error ? "border-red-500" : ""
        }`
  }`;

  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={baseClasses}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg
            className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

function Textarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  required = false,
  minLength,
  error = "",
  darkMode = false,
}) {
  const baseClasses = `w-full px-4 py-3 rounded-lg border transition-all duration-200 outline-none resize-none ${
    darkMode
      ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 ${
          error ? "border-red-500" : ""
        }`
      : `bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-500 ${
          error ? "border-red-500" : ""
        }`
  }`;

  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${
          darkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        minLength={minLength}
        className={baseClasses}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const serviceOptions = [
    { value: "translation", label: "Translation" },
    { value: "transcription", label: "Transcription" },
    { value: "voice-over", label: "Voice Over" },
  ];

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full Name is required";
        else if (value.trim().length < 2) error = "Full Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "phone":
        if (value && !/^[\d\s\-+()]{10,}$/.test(value)) error = "Please enter a valid phone number";
        break;
      case "serviceType":
        if (!value) error = "Please select a service type";
        break;
      case "message":
        if (!value.trim()) error = "Message is required";
        else if (value.trim().length < 10) error = "Message must be at least 10 characters";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });
    setErrors(newErrors);
    setTouched({ fullName: true, email: true, phone: true, serviceType: true, message: true });

    if (isValid) {
      setIsSubmitting(true);
      // Simulate submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ fullName: "", email: "", phone: "", serviceType: "", message: "" });
        setTouched({});
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.serviceType !== "" &&
      formData.message.trim().length >= 10
    );
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? We&apos;d love to hear from you.
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-500 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700">Thank you! We have received your message and will get back to you soon.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>

            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="User Name"
              required={true}
              error={touched.fullName ? errors.fullName : ""}
              darkMode={false}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="mailID@gmail.com"
              required={true}
              error={touched.email ? errors.email : ""}
              darkMode={false}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+91 00000-00000"
              error={touched.phone ? errors.phone : ""}
              darkMode={false}
            />

            <Select
              label="Service Type"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              onBlur={handleBlur}
              options={serviceOptions}
              placeholder="Select a service"
              required={true}
              error={touched.serviceType ? errors.serviceType : ""}
              darkMode={false}
            />

            <Textarea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tell us about your project requirements..."
              rows={5}
              required={true}
              minLength={10}
              error={touched.message ? errors.message : ""}
              darkMode={false}
            />

            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                !isFormValid() || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Email</h3>
            <p className="text-gray-600">contact@projectteja.com</p>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Phone</h3>
            <p className="text-gray-600">+91 00000 00000</p>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Office</h3>
            <p className="text-gray-600">123 ________________<br />India</p>
          </div>
        </div>
      </div>
    </main>
  );
}

