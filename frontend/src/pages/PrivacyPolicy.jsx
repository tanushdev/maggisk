import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/3554-1.jpg')`,
            filter: 'brightness(0.3)'
          }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-5xl md:text-6xl font-serif tracking-tight drop-shadow-lg mb-4">
            Privacy Policy
          </h1>
          <p className="text-theme-cream/80 text-xs md:text-sm tracking-[0.2em] font-bold uppercase">
            Last updated on Nov 25th 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 md:px-10 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-10 text-gray-600 leading-relaxed text-base md:text-lg font-light">
            
            <p>
              This privacy policy sets out how Maggikstones uses and protects any information that you give when you use this website. Maggikstone is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement.
            </p>
            <p>
              Maggikstone may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.
            </p>

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-gray-900 border-b border-gray-100 pb-2">We may collect the following information:</h3>
              <ul className="list-none space-y-3 pl-2">
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>Name and job title</li>
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>Contact information including email address</li>
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>Demographic information such as postcode, preferences and interests</li>
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>Other information relevant to customer surveys and/or offers</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-gray-900 border-b border-gray-100 pb-2">What we do with the information we gather</h3>
              <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
              <ul className="list-none space-y-3 pl-2">
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>Internal record keeping.</li>
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>We may use the information to improve our products and services.</li>
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
                <li className="flex items-start gap-3"><span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-gray-900 border-b border-gray-100 pb-2">Security</h3>
              <p>
                We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-gray-900 border-b border-gray-100 pb-2">How we use cookies</h3>
              <p>
                A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree, the file is added and the cookie helps analyses web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
              </p>
              <p>
                We use traffic log cookies to identify which pages are being used. This helps us analyses data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
              </p>
              <p>
                Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
              </p>
              <p>
                You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-gray-900 border-b border-gray-100 pb-2">Controlling your personal information</h3>
              <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
              <ul className="list-none space-y-3 pl-2 mb-6">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:maggikstones@gmail.com" className="font-bold text-gray-900 hover:text-theme-rust transition-colors">maggikstones@gmail.com</a></span>
                </li>
              </ul>
              <p>
                We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
              </p>
              <p>
                If you believe that any information, we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
