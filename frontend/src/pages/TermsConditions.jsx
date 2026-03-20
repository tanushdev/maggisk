import React from 'react';

const TermsConditions = () => {
  return (
    <div className="terms-container bg-[#FDFBF7]">
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
          <h1 className="text-white text-4xl md:text-6xl font-serif tracking-tight drop-shadow-lg mb-4">
            Terms & Conditions
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 md:px-10 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8 text-gray-600 leading-relaxed text-base md:text-lg font-light">
            
            <p>
              Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Maggikstones relationship with you in relation to this website.
            </p>
            <p>
              The term ‘Maggikstones’ or ‘us’ or ‘we’ refers to the owner of the website whose registered/operational office is at Sector 20, CBD belapur, Navi Mumbai, MAHARASHTRA. The term ‘you’ refers to the user or viewer of our website.
            </p>

            <div className="space-y-4 pt-4">
              <h3 className="text-2xl font-serif text-gray-900 border-b border-gray-100 pb-2">Terms of use</h3>
              <p>The use of this website is subject to the following terms of use:</p>
              <ul className="list-none space-y-4 pl-2">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>You may not create a link to this website from another website or document without Maggikstones’s prior written consent.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-theme-rust rounded-full mt-2.5 flex-shrink-0"></span>
                  <span>Your use of this website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <p>
                We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
