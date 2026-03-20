import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { sendContact } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const address = "301, plot 337B , Ashtvinayak Apt, Sector 20, Belapur, Navi Mumbai, Maharashtra pincode 400614.";
  const email = "maggikstones@gmail.com";
  const phoneNo = "+91 9136366662";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendContact(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-arial">
      {/* Banner Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background image slot */}
        <div className="absolute inset-0 bg-[url('/images/62-1-1.webp')] bg-cover bg-center"></div>
        <div className="relative text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">Contact Us</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left Side: Info & Map */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Get In Touch</h2>
              <div className="h-0.5 w-16 bg-gray-200 mb-12"></div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-gray-50 rounded-sm text-gray-900 border border-gray-100 shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-[0.2em]">Our Sanctuary</h4>
                    <p className="text-lg text-gray-700 font-bold leading-relaxed">{address}</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-gray-50 rounded-sm text-gray-900 border border-gray-100 shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-[0.2em]">Email Us</h4>
                    <p className="text-lg text-gray-700 font-bold underline hover:text-[#D4AF37] transition-colors">{email}</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-gray-50 rounded-sm text-gray-900 border border-gray-100 shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-[0.2em]">Call Us</h4>
                    <p className="text-lg text-gray-700 font-bold">{phoneNo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="rounded-sm overflow-hidden border border-gray-100 shadow-xl h-[400px] transition-all duration-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.083833777414!2d73.0401878!3d19.011681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3bf8f1f5f5f%3A0x8e8e8e8e8e8e8e8e!2sAshtvinayak%20Apartment%2C%20Sector%2020%2C%20Belapur%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710160000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maggik Stones Location"
              ></iframe>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-gray-50 p-8 md:p-12 rounded-sm border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-[0.4em] mb-12 pb-4 border-b border-gray-200">Send a Manifestation</h3>

            {success ? (
              <div className="flex flex-col items-center py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle size={40} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Message Received</h4>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest leading-loose">
                  Your energy has been received. Our seekers will respond through the cosmic channels shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 text-xs font-bold uppercase tracking-widest underline hover:text-theme-rust"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-sm border border-red-100 flex items-center gap-3 text-[10px] font-bold uppercase">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-gray-900 outline-none transition-all text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-gray-900 outline-none transition-all text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Optional"
                    className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-gray-900 outline-none transition-all text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Message *</label>
                  <textarea
                    required
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:border-gray-900 outline-none transition-all text-sm font-bold resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-theme-rust transition-all flex items-center justify-center gap-3 shadow-lg shadow-gray-200 disabled:bg-gray-400 rounded-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><Send size={16} /> Send Manifestation</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Contact;
