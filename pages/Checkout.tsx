import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { useNavigate } from 'react-router-dom';
import LiquidButton from '../components/LiquidButton';
import { Check, ShoppingBag, ShieldCheck } from 'lucide-react';

const styles = `
.card {
  width: 100%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
}

.title {
  width: 100%;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 24px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-weight: 600;
  font-size: 11px;
  color: #63656b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* cart */
.cart .products {
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.cart .products .product {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: stretch;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding-bottom: 20px;
}
.cart .products .product:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.product-image {
    width: 72px;
    height: 96px; /* 3:4 aspect ratio */
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f5f5f4;
    border: 1px solid rgba(0,0,0,0.05);
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 2px;
    padding-bottom: 2px;
}

.product-name {
    font-size: 14px;
    font-weight: 600;
    color: #141414;
    line-height: 1.3;
    font-family: 'Uto', 'Outfit', sans-serif;
    margin-bottom: 2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-meta {
    font-size: 11px;
    color: #7a7c81;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.quantity-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
}

.quantity-control {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #e5e5e4;
    border-radius: 99px;
    height: 28px;
    padding: 0 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.quantity-btn {
    width: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #78716c;
    transition: color 0.2s;
    cursor: pointer;
}
.quantity-btn:hover {
    color: #1c1917;
}

.quantity-value {
    font-size: 12px;
    font-weight: 600;
    width: 20px;
    text-align: center;
    color: #1c1917;
}

/* coupons */
.coupons form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  padding: 20px;
}

.input_field {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border-radius: 6px;
  outline: none;
  border: 1px solid #e5e5e4;
  background: rgba(255,255,255,0.8);
  transition: all 0.3s;
  font-size: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1c1917;
}

.input_field:focus {
  border-color: #1c1917;
  background: white;
}

/* Checkout */
.checkout .details {
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  gap: 12px;
}

.checkout-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checkout-label {
    font-size: 12px;
    color: #78716c;
    font-weight: 500;
}

.checkout-value {
    font-size: 13px;
    color: #1c1917;
    font-weight: 600;
}

.checkout .checkout--footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background-color: rgba(255, 255, 255, 0.4);
  border-top: 1px solid rgba(0,0,0,0.05);
  border-radius: 0 0 12px 12px;
}

.price {
  position: relative;
  font-size: 18px;
  color: #141414;
  font-weight: 700;
  font-family: 'Uto', 'Outfit', sans-serif;
}

.price sup {
  font-size: 11px;
  top: -6px;
  font-weight: 500;
  margin-right: 2px;
}
`;

const Checkout = () => {
  const { cart, placeOrder, validatePromo, updateQuantity } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BankTransfer'>('COD');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [error, setError] = useState('');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Captcha State
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  useEffect(() => {
      setCaptcha({
          num1: Math.floor(Math.random() * 5) + 1,
          num2: Math.floor(Math.random() * 5) + 1
      });
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * discountPercent;
  const shippingFee = 0; // Free shipping
  const total = subtotal - discountAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = validatePromo(promoCode);
    if (discount > 0) {
      setDiscountPercent(discount);
      setError('');
    } else {
      setDiscountPercent(0);
      setError('Invalid code');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Captcha Validation
    if (parseInt(captchaInput) !== captcha.num1 + captcha.num2) {
        setCaptchaError(true);
        return;
    }

    placeOrder({
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      city: formData.city,
      items: cart,
      total: total,
      paymentMethod: paymentMethod,
    });
    
    // Instead of alerting, set state to show thank you screen
    setIsOrderPlaced(true);
    window.scrollTo(0, 0);
  };

  if (isOrderPlaced) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 md:px-6 animate-fade-in text-center">
            <div className="mb-8 relative">
                <div className="w-24 h-24 rounded-full bg-[#141414] flex items-center justify-center shadow-2xl relative z-10">
                    <Check className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 bg-stone-200 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl text-obsidian mb-4">
                Thank You
            </h1>
            
            <p className="text-sm md:text-base text-stone-500 max-w-md leading-relaxed mb-8">
                Your order has been placed successfully. <br/>
                We will contact you shortly to confirm the details.
            </p>

            <div className="flex gap-4">
                <LiquidButton 
                    onClick={() => navigate('/')} 
                    variant="solid" 
                    className="px-8 py-3 text-xs uppercase tracking-widest font-bold"
                >
                    Continue Shopping
                </LiquidButton>
            </div>
        </div>
    );
  }

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center font-sans text-stone-500 flex-col gap-4 animate-fade-in">
        <div className="p-6 bg-stone-100 rounded-full mb-2">
            <ShoppingBag className="w-8 h-8 opacity-30 stroke-1"/>
        </div>
        <p className="font-serif text-lg text-obsidian">Your cart is empty.</p>
        <LiquidButton onClick={() => navigate('/collection')} variant="outline" className="px-8 py-3 text-xs uppercase tracking-widest mt-2 border-stone-300">
            Browse Collection
        </LiquidButton>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-10">
      <style>{styles}</style>
      <h1 className="font-serif text-3xl md:text-4xl mb-8 md:mb-12 text-obsidian">Checkout</h1>
      
      {/* 
         Main Layout Grid 
         - Mobile: Single column, we use display: contents on wrappers to flatten children into this grid for ordering
         - Desktop: Two columns, standard layout
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-24 items-start">
        
        {/* 
           Form Wrapper 
           - Mobile: 'contents' removes the form box, making sections direct grid children.
           - Desktop: 'block' restores the form box. 'md:order-1' ensures it is the left column.
        */}
        <form id="checkout-form" onSubmit={handleSubmit} className="contents md:block md:order-1 space-y-10">
            
            {/* Contact Section - Order 2 on Mobile */}
            <section className="order-2 md:order-none md:mb-10">
                <h2 className="text-xs uppercase tracking-widest opacity-50 mb-6 font-sans border-b border-obsidian/10 pb-2">Contact & Shipping</h2>
                <div className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold ml-1">Email</label>
                        <input 
                            required 
                            type="email" 
                            placeholder="your@email.com" 
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian transition-all font-sans text-sm"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                         <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold ml-1">Full Name</label>
                        <input 
                            required 
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian transition-all font-sans text-sm"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                         <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold ml-1">Phone</label>
                        <input 
                            required 
                            type="tel" 
                            placeholder="+92 300 1234567" 
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian transition-all font-sans text-sm"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                         <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold ml-1">Address</label>
                        <input 
                            required 
                            type="text" 
                            placeholder="House #, Street, Area" 
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian transition-all font-sans text-sm"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-2/3 space-y-1">
                             <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold ml-1">City</label>
                            <input 
                                required 
                                type="text" 
                                placeholder="Lahore" 
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian transition-all font-sans text-sm"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="w-1/3 space-y-1">
                             <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold ml-1">Postcode</label>
                            <input 
                                type="text" 
                                placeholder="54000" 
                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian transition-all font-sans text-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Section - Order 3 on Mobile */}
            <section className="order-3 md:order-none">
                <h2 className="text-xs uppercase tracking-widest opacity-50 mb-6 font-sans border-b border-obsidian/10 pb-2">Payment Method</h2>
                <div className="space-y-4 font-sans">
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-obsidian bg-stone-50 shadow-sm' : 'border-stone-200 hover:border-stone-300'}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${paymentMethod === 'COD' ? 'border-obsidian' : 'border-stone-300'}`}>
                            {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-obsidian" />}
                        </div>
                        <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'COD'} 
                            onChange={() => setPaymentMethod('COD')}
                            className="hidden"
                        />
                        <span className="text-sm font-medium">Cash on Delivery</span>
                    </label>
                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'BankTransfer' ? 'border-obsidian bg-stone-50 shadow-sm' : 'border-stone-200 hover:border-stone-300'}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${paymentMethod === 'BankTransfer' ? 'border-obsidian' : 'border-stone-300'}`}>
                             {paymentMethod === 'BankTransfer' && <div className="w-2 h-2 rounded-full bg-obsidian" />}
                        </div>
                        <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'BankTransfer'} 
                            onChange={() => setPaymentMethod('BankTransfer')}
                            className="hidden"
                        />
                        <span className="text-sm font-medium">Bank Transfer</span>
                    </label>
                </div>

                {paymentMethod === 'BankTransfer' && (
                    <div className="bg-stone-50/80 p-6 text-sm space-y-3 border border-stone-200 mt-4 rounded-xl animate-fade-in font-sans">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Bank Details</p>
                            <div className="mt-2 space-y-1">
                                <p className="flex justify-between border-b border-stone-200 pb-1"><span>Account Title</span> <span className="font-semibold text-right">Muhammad Sohaib Mushtaq</span></p>
                                <p className="flex justify-between border-b border-stone-200 pb-1 pt-1"><span>Bank</span> <span className="font-semibold text-right">Bank Alfalah</span></p>
                                <p className="flex justify-between pt-1 break-all"><span>IBAN</span> <span className="font-mono text-xs font-semibold text-right">PK21ALFH0570001010594265</span></p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-200/50">
                            <p className="text-red-900 font-medium text-xs uppercase tracking-wide mb-1">Instruction</p>
                            <p className="text-stone-600 leading-relaxed">Please send a screenshot of the transaction to the number below to confirm your order.</p>
                            <a href="https://wa.me/923079909749" target="_blank" rel="noreferrer" className="inline-block mt-2 font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200">+92 307 9909749</a>
                        </div>
                    </div>
                )}
            </section>
        </form>

        {/* 
           Right Column / Summary Wrapper 
           - Mobile: 'contents' flattens layout.
           - Desktop: 'block' creates the right column. 'md:order-2' ensures it is on the right.
        */}
        <div className="contents md:block md:order-2">
            <div className="contents md:flex md:flex-col md:sticky md:top-24 md:gap-5 w-full max-w-[450px] mx-auto md:mx-0">
              
              {/* Card: Cart Items - Order 1 on Mobile (First Item) */}
              <div className="card cart order-1 md:order-none">
                <div className="title">Your cart</div>
                <div className="products">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="product">
                      {/* Image */}
                      <div className="product-image">
                        <img src={item.images[0]} alt={item.name} />
                      </div>
                      
                      {/* Content */}
                      <div className="product-details">
                         {/* Header: Name & Price */}
                         <div className="flex justify-between items-start">
                             <div className="pr-4">
                                <h4 className="product-name">{item.name}</h4>
                                <span className="product-meta">{item.category}</span>
                             </div>
                             <div className="text-right whitespace-nowrap">
                                <span className="text-xs font-bold text-obsidian">PKR {(item.price * item.quantity).toLocaleString()}</span>
                             </div>
                         </div>

                         {/* Footer: Size & Quantity */}
                         <div className="flex justify-between items-end mt-auto pt-2">
                             <div className="bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                Size: {item.selectedSize}
                             </div>
                             
                             <div className="quantity-control">
                                 <button type="button" onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="quantity-btn">
                                    <svg width="8" height="2" viewBox="0 0 8 2" fill="none"><path d="M0 1H8" stroke="currentColor" strokeWidth="1.5"/></svg>
                                 </button>
                                 <span className="quantity-value">{item.quantity}</span>
                                 <button type="button" onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="quantity-btn">
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 0V8M0 4H8" stroke="currentColor" strokeWidth="1.5"/></svg>
                                 </button>
                             </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card: Coupons - Order 4 on Mobile */}
              <div className="card coupons order-4 md:order-none">
                <div className="title">Promo Code</div>
                <form className="form" onSubmit={handleApplyPromo}>
                    <input 
                        type="text" 
                        placeholder="Enter code" 
                        className="input_field placeholder:text-stone-400" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <LiquidButton type="submit" variant="solid" className="h-[42px] px-6 text-[10px] uppercase tracking-widest font-bold">Apply</LiquidButton>
                </form>
                {error && <p className="text-red-500 text-xs px-6 pb-4 -mt-2 font-sans font-medium">{error}</p>}
                {discountPercent > 0 && <p className="text-emerald-700 text-xs px-6 pb-4 -mt-2 font-sans font-bold">Discount applied!</p>}
              </div>

              {/* Card: Checkout Totals - Order 5 on Mobile */}
              <div className="card checkout order-5 md:order-none">
                <div className="title">Order Summary</div>
                <div className="details">
                  <div className="checkout-row">
                      <span className="checkout-label">Subtotal</span>
                      <span className="checkout-value">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discountPercent > 0 && (
                      <div className="checkout-row">
                          <span className="checkout-label text-emerald-700">Discount</span>
                          <span className="checkout-value text-emerald-700">- PKR {discountAmount.toLocaleString()}</span>
                      </div>
                  )}
                  
                  <div className="checkout-row">
                      <span className="checkout-label">Shipping</span>
                      <span className="checkout-value">{shippingFee === 0 ? 'Free' : `PKR ${shippingFee}`}</span>
                  </div>
                </div>
                
                {/* Security CAPTCHA Section */}
                <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/50">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Security Check
                        </span>
                        {captchaError && <span className="text-[10px] text-red-600 font-bold animate-pulse">Incorrect Answer</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-stone-700 bg-white border border-stone-200 px-4 py-2 rounded select-none shadow-sm flex-1 text-center font-serif">
                            {captcha.num1} + {captcha.num2} = ?
                        </div>
                        <input 
                            type="number"
                            className={`w-20 h-[38px] border rounded px-2 text-center text-sm outline-none transition-all ${captchaError ? 'border-red-300 bg-red-50 text-red-900' : 'border-stone-200 focus:border-obsidian bg-white'}`}
                            value={captchaInput}
                            onChange={(e) => {
                                setCaptchaInput(e.target.value);
                                setCaptchaError(false);
                            }}
                            placeholder=""
                        />
                    </div>
                </div>

                <div className="checkout--footer">
                  <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-1">Total</span>
                      <label className="price"><sup>PKR</sup>{total.toLocaleString()}</label>
                  </div>
                  <LiquidButton variant="solid" className="w-[160px] h-[48px] text-[11px] uppercase tracking-widest font-bold shadow-lg shadow-obsidian/20" form="checkout-form" type="submit">Place Order</LiquidButton>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;