"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, Send, Mail, CheckCircle2 } from "lucide-react";

export const Contact: React.FC = () => {
  const email = "abc@gmail.com";
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userEmail: "",
    subject: "Creative Project Collaboration",
    message: "",
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `Hi Abhro,\n\nMy name is ${formData.name} (${formData.userEmail}).\n\n${formData.message}`
      )}`;
    }, 600);
  };

  return (
    <section
      id="contact"
      aria-label="Contact Section"
      className="relative w-full bg-portfolio-bg py-16 sm:py-24 px-4 sm:px-8 md:px-12"
    >
      <div className="w-full max-w-[1240px] mx-auto">
        {/* Contact Container Box matching Figma Rectangle 14 (rounded-12px, #D9D9D9) */}
        <div className="">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 lg:gap-12">
            {/* Left Column: "Lets Create Together ↗" header */}
            <div className="shrink-0 mb-6 lg:mb-0 ">
              <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl lg:text-[88px] xl:text-[108px] tracking-tight leading-[0.95] lg:leading-[0.88] text-black flex flex-row flex-wrap items-center gap-2 sm:gap-3 lg:flex-col lg:items-start lg:gap-0 select-none">
                <span>Lets</span>
                <span className="text-brand font-narina my-0 lg:my-1 xl:my-2">Create</span>
                <span className="inline-flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <span>Together</span>
                  <span className="inline-flex w-9 sm:w-12 lg:w-20 xl:w-24 h-9 sm:h-12 lg:h-20 xl:h-24 items-center justify-center -translate-y-0.5 lg:-translate-y-2">
                    <Image
                      src="/assets/arrow-up-right.svg"
                      alt="Arrow"
                      width={96}
                      height={96}
                      className="w-8 sm:w-11 lg:w-20 xl:w-24 h-auto"
                    />
                  </span>
                </span>
              </h2>
            </div>
            {/* Right Column: Send a Quick Message Form */}
            <div className="w-full lg:max-w-[640px] flex-1 bg-white/90 rounded-2xl p-6 sm:p-8 md:p-10 border border-neutral-300 shadow-sm">
              {formSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="font-anton text-2xl text-neutral-900 tracking-wide mb-2">
                    MESSAGE PREPARED!
                  </h4>
                  <p className="text-sm text-neutral-600 max-w-sm mb-6">
                    Your email client has been opened with your inquiry for{" "}
                    <span className="font-mono font-medium text-brand">{email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-medium text-brand hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Hunter"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={formData.userEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, userEmail: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Project Type / Topic
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3D Animation / Illustration Commission"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project, ideas, or timeline..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand-bright text-white font-anton text-base tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
                  >
                    {loading ? (
                      <span>PREPARING...</span>
                    ) : (
                      <>
                        <span>SEND INQUIRY TO {email}</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
