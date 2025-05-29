import React, { useState, useEffect } from 'react';
import { BsChatDots } from 'react-icons/bs';
import ChatBox from './ChatBox';
import { useLocation } from 'react-router-dom';

const ContactFloating = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-full shadow-lg transition"
        >
          <BsChatDots className="text-white text-xl" />
          <span>Chat</span>
        </button>
      </div>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[320px] h-[400px] bg-white rounded-lg shadow-lg border border-gray-200">
          <ChatBox onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default ContactFloating;
