import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#24a4f2] py-8">
      <div className="px-4 md:px-8 lg:px-48">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="/" className="text-lg font-bold">
                Salus Pharmacy
            </a>
          </div>
          <ul className="flex space-x-4">
            <li>
              <a href="/about" className="hover:text-gray-400">
                About
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-gray-400">
                Services
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-gray-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-6 text-center text-sm">Design by Nguyen Kim Hong & Nguyen Nhat Huy</div>
        <div className="mt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} Salus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;