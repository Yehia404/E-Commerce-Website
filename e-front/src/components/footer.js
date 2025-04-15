import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-10 ">
      <div className="grid md:grid-cols-5 gap-10">
        {/* Left Side: Logo + Description + Socials */}
        <div className="md:col-span-2">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "Dancing Script, cursive",
            }}
          >
            VibeWear
          </h2>
          <p className="text-sm max-w-[180px] mb-4">
            We have clothes that suit your style and which you're proud to wear.
            From women to men.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-white hover:text-gray-400">
              <FaFacebookF />
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <FaTwitter />
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <FaInstagram />
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Right Side: Links */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="font-semibold mb-1">Company</p>
            <ul className="space-y-1">
              <li>About</li>
              <li>Features</li>
              <li>Works</li>
              <li>Careers</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Help</p>
            <ul className="space-y-1">
              <li>Customer Support</li>
              <li>Delivery Details</li>
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">FAQ</p>
            <ul className="space-y-1">
              <li>Account</li>
              <li>Orders</li>
              <li>Payments</li>
              <li>Returns</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Resources</p>
            <ul className="space-y-1">
              <li>Free eBooks</li>
              <li>How-to Blog</li>
              <li>Tutorials</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="text-center mt-6 text-xs text-gray-400">
        Shop.co © 2025. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
// import React from "react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-black text-white">
//       <div className="grid md:grid-cols-5 gap-10">
//         {/* Left Side: Logo + Description + Socials */}
//         <div className="md:col-span-2">
//           <h2
//             className="text-2xl font-bold mb-2"
//             style={{
//               fontFamily: "Dancing Script, cursive",
//             }}
//           >
//             VibeWear
//           </h2>
//           <p className="text-sm max-w-[180px] mb-4">
//             We have clothes that suit your style and which you're proud to wear.
//             From women to men.
//           </p>

//           {/* Social Media Icons */}
//           <div className="flex items-center gap-4">
//             <a href="#" className="text-white hover:text-gray-400">
//               <FaFacebookF />
//             </a>
//             <a href="#" className="text-white hover:text-gray-400">
//               <FaTwitter />
//             </a>
//             <a href="#" className="text-white hover:text-gray-400">
//               <FaInstagram />
//             </a>
//             <a href="#" className="text-white hover:text-gray-400">
//               <FaLinkedinIn />
//             </a>
//           </div>
//         </div>

//         {/* Right Side: Links */}
//         <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
//           <div>
//             <p className="font-semibold mb-1">Company</p>
//             <ul className="space-y-1">
//               <li>About</li>
//               <li>Features</li>
//               <li>Works</li>
//               <li>Careers</li>
//             </ul>
//           </div>
//           <div>
//             <p className="font-semibold mb-1">Help</p>
//             <ul className="space-y-1">
//               <li>Customer Support</li>
//               <li>Delivery Details</li>
//               <li>Terms</li>
//               <li>Privacy</li>
//             </ul>
//           </div>
//           <div>
//             <p className="font-semibold mb-1">FAQ</p>
//             <ul className="space-y-1">
//               <li>Account</li>
//               <li>Orders</li>
//               <li>Payments</li>
//               <li>Returns</li>
//             </ul>
//           </div>
//           <div>
//             <p className="font-semibold mb-1">Resources</p>
//             <ul className="space-y-1">
//               <li>Free eBooks</li>
//               <li>How-to Blog</li>
//               <li>Tutorials</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <p className="text-center mt-6 text-xs text-gray-400">
//         Shop.co © 2025. All rights reserved.
//       </p>
//     </footer>
//   );
// };

// export default Footer;
