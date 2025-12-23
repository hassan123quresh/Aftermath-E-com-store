import React, { useEffect } from 'react';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto animate-fade-in font-sans text-obsidian">
        {/* Header */}
        <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-serif italic mb-4">Refund Policy</h1>
            <p className="text-xs uppercase tracking-widest opacity-50">Last updated: November 13, 2025</p>
        </div>

        <div className="space-y-8">
            {/* Intro */}
            <div className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">Returns</h2>
                <p className="text-sm leading-relaxed opacity-80">
                    We have a 15-day return policy, which means you have 15 days after receiving your item to request a return.
                    <br/><br/>
                    To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                </p>
            </div>

            {/* How to Start */}
            <div className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">How to Start a Return</h2>
                <p className="text-sm leading-relaxed opacity-80">
                    To start a return, you can contact us at <a href="mailto:aftermathstore@hotmail.com" className="underline hover:text-stone-500">aftermathstore@hotmail.com</a>. Please note that returns will need to be sent to the specific address provided upon approval.
                    <br/><br/>
                    If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
                    <br/><br/>
                    You can always contact us for any return question at <a href="mailto:hello@aftermathstore.com" className="underline hover:text-stone-500">hello@aftermathstore.com</a>.
                </p>
            </div>

            {/* Damages */}
             <div className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">Damages and Issues</h2>
                <p className="text-sm leading-relaxed opacity-80">
                    Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                </p>
            </div>

            {/* Exceptions */}
            <div className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">Exceptions / Non-returnable Items</h2>
                <div className="text-sm leading-relaxed opacity-80 space-y-4">
                    <p>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.</p>
                    <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>
                </div>
            </div>

            {/* Exchanges */}
            <div className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">Exchanges</h2>
                <p className="text-sm leading-relaxed opacity-80">
                    The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
                </p>
            </div>

            {/* EU Policy */}
            <div className="bg-white border border-stone-200 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">European Union 14 Day Cooling Off Period</h2>
                <p className="text-sm leading-relaxed opacity-80">
                    Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                </p>
            </div>

            {/* Refunds */}
            <div className="bg-obsidian text-stone-100 p-6 md:p-10 shadow-sm">
                <h2 className="font-serif text-2xl mb-6">Refunds</h2>
                <p className="text-sm leading-relaxed opacity-80">
                    We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.
                    <br/><br/>
                    If more than 15 business days have passed since we’ve approved your return, please contact us at <a href="mailto:aftermathstore@hotmail.com" className="underline hover:text-stone-300">aftermathstore@hotmail.com</a>.
                </p>
            </div>

        </div>
    </div>
  );
};

export default RefundPolicy;