import { useForm } from "react-hook-form";
import {showAcceptToast, showErrorToast} from "../Utils/toastUtils.js"

function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    formData.append("access_key", import.meta.env.VITE_EMAIL_ACCESS_KEY);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: json
    }).then((res) => res.json())

    if (res.success){
      showAcceptToast("Form submitted successfully!");
      reset();
    } else {
      showErrorToast("Unable to send form");
    }
  };

  return (
    <div className="w-full flex-grow overflow-y-auto bg-gray-50 text-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question, suggestion, or feedback? Fill out the form below and we’ll get back to you.
          </p>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-2xl p-8 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block font-medium mb-1">Subject</label>
            <input
              type="text"
              {...register("subject", { required: "Subject is required" })}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              rows="5"
              {...register("message", { required: "Message is required" })}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;