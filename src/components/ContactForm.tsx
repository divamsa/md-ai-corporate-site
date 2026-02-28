"use client";

import { useState } from "react";

interface ContactFormProps {
  onSubmitted: () => void;
  submitted: boolean;
}

export default function ContactForm({
  onSubmitted,
  submitted,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitted();
  };

  if (submitted) {
    return (
      <section id="contact" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200">
            <span className="text-5xl block mb-4">✅</span>
            <h2 className="text-2xl font-bold text-slate-900">
              お問い合わせありがとうございます
            </h2>
            <p className="mt-4 text-slate-600">
              内容を確認の上、担当者よりご連絡いたします。
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            お問い合わせ
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            生成AI導入に関するご相談はお気軽にどうぞ
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="山田 太郎"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="taro@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              会社名
            </label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="株式会社マネーデザイン"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              お問い合わせ内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
              placeholder="生成AI導入についてご相談したいことを記入してください"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition shadow-sm"
          >
            送信する
          </button>
        </form>
      </div>
    </section>
  );
}
