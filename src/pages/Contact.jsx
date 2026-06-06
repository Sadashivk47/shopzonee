import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Headset, ArrowRight, Check, Loader2 } from 'lucide-react';

export const Contact = () => {
  // Form coordinates
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate request API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset details after 3 seconds feedback
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setEmail('');
        setMessage('');
        setSubject('General Inquiry');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-32">
      {/* Hero Header Section */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-16 font-sans">
        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-900 text-[10.5px] font-bold uppercase tracking-widest mb-4 border border-slate-200">
          Contact Us
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          We'd love to hear from you
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Our team is available to help with any questions you have about our platform, services, or pricing.
        </p>
      </section>

      {/* Forms & Infobox split grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        {/* Contact Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-150/40 p-6 md:p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700" htmlFor="cf-name">Full Name</label>
                <input
                  id="cf-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/20 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-105 focus:bg-white transition-all placeholder:text-slate-350"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700" htmlFor="cf-email">Email Address</label>
                <input
                  id="cf-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/20 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-105 focus:bg-white transition-all placeholder:text-slate-350"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="cf-subject">Subject</label>
              <select
                id="cf-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 px-4 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/20 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-105 focus:bg-white transition-all"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Question">Billing Question</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="cf-message">How can we help?</label>
              <textarea
                id="cf-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more about your request..."
                className="w-full px-4 py-3.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/20 focus:outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-105 focus:bg-white transition-all resize-none placeholder:text-slate-350"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-xs select-none transition-all duration-300 flex items-center justify-center gap-2 outline-none cursor-pointer ${
                isSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 text-[#D4FC79] hover:bg-slate-900 shadow-sm'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" /> Message Sent Successfully!
                </>
              ) : (
                'Send message'
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Infobox Info cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-150/40 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Headset className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[15px] text-slate-900 mb-1">Interactive Support</h3>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">Our friendly customer care team is online 24/7.</p>
                <a
                  href="mailto:support@shopzone.com"
                  className="text-xs font-bold text-slate-950 hover:underline inline-flex items-center gap-1"
                >
                  support@shopzone.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-5 border-t border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-slate-900 mb-1">Corporate Office</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ShopZone India, Tech Park Sector-III<br />
                  Hitech City, Hyderabad, India 500081
                </p>
              </div>
            </div>
          </div>

          {/* Help Center CTA */}
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 md:p-8 text-white">
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-bold tracking-tight">Need immediate FAQs?</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Get instant answers to shipping policies, credit warranties, global currencies, and account setups directly inside our FAQs portal.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all hover:bg-slate-50"
              >
                <span>Browse Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Styled vector map placeholder */}
      <section className="max-w-7xl mx-auto px-6 mt-16 font-sans">
        <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-200/50 shadow-sm">
          {/* Using template image exactly to preserve style */}
          <img
            alt="Office Location Map placeholder"
            className="w-full h-full object-cover grayscale brightness-90 shadow-inner select-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUO_b_G9-8o3y033Zogb0j02pUZb-A2Vdlud1x6n2YUsZgKuyYxeB7ouiKE8C8s6pUGiCPMBqrmvTZspOSSvCSu3xEl0kw9hrHTZenAdq05I9usaOGFZzhQBKleyVengdrHB0bjmXfcMhgJmylpwD2RKcoPdBY67WLCCye-1LA7mrEpsc8afewQR0NqpK62B8vI8sUTI1Z9WDgjlAMb0ZOAq1qDT2M9x9GOj2tpy-UBHDOZmRBFd6grGt1yH63gpcg-jR-jVjn4_8"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/5 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <div className="absolute inset-0 bg-slate-950/20 rounded-full animate-ping"></div>
              <div className="relative w-12 h-12 bg-slate-950 text-[#D4FC79] rounded-full flex items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 fill-current" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-900 mb-1">Hyderabad Office</p>
            <p className="text-[11px] text-slate-400 font-medium">Call us during business hours (9AM-6PM IST).</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
