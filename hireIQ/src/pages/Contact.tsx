// pages/Contact.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent!");
  };

  return (
    <div style={styles.container}>
      <h1>Contact Us</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const styles: {
  container: React.CSSProperties;
  form: React.CSSProperties;
} = {
  container: {
    padding: "40px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
    margin: "auto",
  },
};

export default Contact;