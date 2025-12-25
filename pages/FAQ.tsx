import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "Orders & Payments",
      items: [
        {
          q: "How do I place an order?",
          a: "Simply navigate to the product you wish to purchase, select your size, and click 'Add to Cart'. When you are ready, proceed to checkout where you can enter your shipping details and select your payment method."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept Cash on Delivery (COD) and direct Bank Transfer. For Bank Transfers, please share a screenshot of your transaction with us on WhatsApp to confirm your order."
        },
        {
          q: "Can I cancel my order?",
          a: "Orders can be cancelled within 24 hours of placement if they have not yet been shipped. Please contact us immediately via WhatsApp or Email."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          q: "Do you offer free shipping?",
          a: "Yes, we offer free shipping on all orders nationwide across Pakistan."
        },
        {
          q: "How long will my order take to arrive?",
          a: "Standard delivery time is 3–5 business days. During sale periods or holidays, slight delays may occur."
        },
        {
          q: "Do you ship internationally?",
          a: "Currently, we only ship within Pakistan. International shipping options will be available in the future."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      items: [
        {
          q: "What is your return policy?",
          a: "We offer a 15-day return policy. Items must be unworn, unwashed, and in their original packaging with tags attached."
        },
        {
          q: "How do I initiate a return?",
          a: "Please email us at aftermathstore@hotmail.com or contact us on WhatsApp with your Order ID and reason for return. We will guide you through the process."
        },
        {
          q: "Do you offer refunds?",
          a: "Yes. Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 10 business days."
        }
      ]
    },
    {
      title: "Product & Sizing",
      items: [
        {
          q: "Where can I find the size guide?",
          a: "Each product page includes detailed measurements for Body Length, Chest, Sleeve, and Shoulder in the description. We recommend comparing these with your favorite garment for the best fit."
        },
        {
          q: "How should I care for my Aftermath pieces?",
          a: "Most of our fleece and knit items should be washed on a gentle cycle with cold water and hung to dry to maintain their structure and texture. Avoid bleach and high-heat drying."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-4 md:pt-10 pb-24 px-4 md:px-6 max-w-4xl mx-auto animate-fade-in font-sans text-obsidian">
        {/* Header */}
        <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Frequently Asked Questions</h1>
            <p className="text-xs uppercase tracking-widest opacity-50">Common inquiries & support</p>
        </div>

        <div className="space-y-8">
            {sections.map((section, idx) => (
                <div key={idx} className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                    <h2 className="font-serif text-2xl mb-8 border-b border-stone-100 pb-4">{section.title}</h2>
                    <div className="space-y-8">
                        {section.items.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <h3 className="text-sm font-bold text-obsidian uppercase tracking-wide">{item.q}</h3>
                                <p className="text-sm leading-relaxed opacity-80 text-stone-600">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Contact Fallback */}
            <div className="bg-obsidian text-stone-100 p-6 md:p-10 shadow-sm text-center">
                <h2 className="font-serif text-2xl mb-4">Still have questions?</h2>
                <p className="text-sm leading-relaxed opacity-80 mb-8">
                    We are here to help. Reach out to our support team directly.
                </p>
                <Link to="/contact" className="inline-block border border-stone-500 hover:border-white text-stone-300 hover:text-white px-8 py-3 text-xs uppercase tracking-widest transition-all">
                    Contact Support
                </Link>
            </div>
        </div>
    </div>
  );
};

export default FAQ;