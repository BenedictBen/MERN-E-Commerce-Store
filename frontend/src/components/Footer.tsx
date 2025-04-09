import Image from "next/image";
import {
  BsTwitterX,
  BsFacebook,
  BsYoutube,
  BsInstagram,
  BsWhatsapp,
} from "react-icons/bs";

export default function Footer() {
  const paymentMethods = [
    { id: 1, image: "/home/footer-bank-transfer-1.png" },
    { id: 2, image: "/home/footer-visa-1.png" },
    { id: 3, image: "/home/footer-mastercard-1.png" },
    { id: 4, image: "/home/footer-paypal-1.png" },
  ];

  return (
    <>
      <hr className="!my-4 !px-6 border-gray-200" />
    <footer className="!px-6 !pb-0 !mb-0">
      {/* Top Section: Four columns + “Let’s keep in touch” */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 justify-center">
        {/* Column 1 */}
        <div>
          <h1 className="mb-4 text-lg !font-semibold uppercase">
            Get to Know Us
          </h1>
          <ul className="space-y-2 text-gray-600">
            <li>About Us</li>
            <li>News &amp; Blog</li>
            <li>Careers</li>
            <li>Investors</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h1 className="mb-4 text-lg !font-semibold uppercase">
            Customer Service
          </h1>
          <ul className="space-y-2 text-gray-600">
            <li>Help Center</li>
            <li>FAQ’s</li>
            <li>Accessibility</li>
            <li>Size Guide</li>
            <li>Payment Method</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h1 className="mb-4 text-lg !font-semibold uppercase">
            Orders &amp; Returns
          </h1>
          <ul className="space-y-2 text-gray-600">
            <li>Track Order</li>
            <li>Shipping &amp; Delivery</li>
            <li>Return &amp; Exchange</li>
            <li>Price Match Guarantee</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h1 className="mb-4 text-lg !font-semibold uppercase">Legal</h1>
          <ul className="space-y-2 text-gray-600">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Legal</li>
            <li>Site Map</li>
          </ul>
        </div>

        {/* Column 5: Let’s keep in touch */}
        <div>
          <h1 className="!mb-2 text-lg !font-semibold uppercase">
            Let’s Keep in Touch
          </h1>
          <p className="!mb-4 !text-sm text-gray-600">
            Get recommendations, tips, updates and more.
          </p>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 h-12 !min-w-[180px] !px-4 rounded-full !border-2 !border-gray-500 focus:outline-none"
            />
            <button className="h-12 !px-4 md:!px-6 rounded-full !bg-[#4e04fb] !text-white hover:bg-indigo-700 whitespace-nowrap">
              Subscribe
            </button>
          </div>

          {/* Social Icons */}
          <h1 className="!my-2 text-lg font-semibold uppercase">
            Stay Connected
          </h1>
          <div className="flex items-center justify-start gap-2 text-gray-600">
            <BsTwitterX
              size={20}
              className="cursor-pointer hover:text-indigo-600"
            />
            <BsFacebook
              size={20}
              className="cursor-pointer hover:text-indigo-600"
            />
            <BsYoutube
              size={20}
              className="cursor-pointer hover:text-indigo-600"
            />
            <BsInstagram
              size={20}
              className="cursor-pointer hover:text-indigo-600"
            />
            <BsWhatsapp
              size={20}
              className="cursor-pointer hover:text-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="!my-4 border-gray-200" />

      {/* Bottom Section: Copyright & Payment icons */}
      <div className="flex flex-col !mb-2 items-center justify-between md:flex-row gap-2">
        <div>
          <p className="text-sm text-gray-600">
            Template inspired by Motta. Copyright © 2025, All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <Image
                src={method.image}
                width={50}
                height={50}
                alt="payment method"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
    </>
  );
}
