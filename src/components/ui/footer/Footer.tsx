import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer-fill py-4 mt-16 text-footer-regular">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Lease Pixie. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300 transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
