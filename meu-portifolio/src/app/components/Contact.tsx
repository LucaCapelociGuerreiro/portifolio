import React from 'react';

const Contact = () => {
  return (
<section id="contact" className="py-16 bg-black text-white">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center text-white mb-12">Contact Me</h2>
    
    <div className="max-w-lg mx-auto">
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition-all"
            required
          ></textarea>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
          >
            Send Message
          </button>
        </div>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-gray-400">Or reach me at:</p>
        <p className="text-gray-300 font-medium mt-1">contact@example.com</p>
      </div>
    </div>
  </div>
</section>

  );
};

export default Contact;