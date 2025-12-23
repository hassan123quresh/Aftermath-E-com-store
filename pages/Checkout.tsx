import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { useNavigate } from 'react-router-dom';

const styles = `
.master-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 450px; 
}

.card {
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

.title {
  width: 100%;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-weight: 600;
  font-size: 11px;
  color: #63656b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Inter', sans-serif;
}

/* cart */
.cart .products {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.cart .products .product {
  display: grid;
  grid-template-columns: 60px 1fr 90px auto;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding-bottom: 16px;
}
.cart .products .product:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.cart .products .product .product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cart .products .product span {
  font-size: 13px;
  font-weight: 500;
  color: #141414;
  margin-bottom: 4px;
  display: block;
  line-height: 1.2;
}

.cart .products .product p {
  font-size: 11px;
  font-weight: 400;
  color: #7a7c81;
  letter-spacing: 0.02em;
  margin: 0;
  line-height: 1.4;
}

.cart .quantity {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 99px;
  overflow: hidden;
  width: 100%;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}

.cart .quantity label {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #141414;
  margin: 0;
  padding: 0;
}

.cart .quantity button {
  width: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  color: #141414;
  padding: 0;
  transition: all 0.2s;
}

.cart .quantity button:hover {
    background-color: rgba(255, 255, 255, 0.8);
}

.card .small {
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  font-family: 'Inter', sans-serif;
  color: #141414;
}

/* coupons */
.coupons form {
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 10px;
  padding: 10px;
}

.input_field {
  width: auto;
  height: 40px;
  padding: 0 0 0 12px;
  border-radius: 8px;
  outline: none;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.5);
  transition: all 0.3s;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
}

.input_field:focus {
  border-color: #141414;
  background: white;
}

/* Checkout */
.checkout .details {
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 15px 20px;
  gap: 8px;
}

.checkout .details span {
  font-size: 13px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.checkout .details span:nth-child(odd) {
  font-size: 11px;
  font-weight: 600;
  color: #707175;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.checkout .details span:nth-child(even) {
  text-align: right;
  color: #141414;
}

.checkout .checkout--footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-top: 1px solid rgba(0,0,0,0.05);
  border-radius: 0 0 12px 12px;
}

.price {
  position: relative;
  font-size: 18px;
  color: #141414;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.price sup {
  font-size: 11px;
  top: -6px;
  font-weight: 500;
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
    alert('Order Placed Successfully. We will contact you shortly.');
    navigate('/');
  };

  if (cart.length === 0) return <div className="p-24 text-center font-sans">Your cart is empty.</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <style>{styles}</style>
      <h1 className="font-serif text-3xl mb-12">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <section>
                <h2 className="text-xs uppercase tracking-widest opacity-50 mb-6 font-sans">Contact & Shipping</h2>
                <div className="space-y-4">
                    <input 
                        required 
                        type="email" 
                        placeholder="Email" 
                        className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-obsidian transition-colors font-sans"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        required 
                        type="text" 
                        placeholder="Full Name" 
                        className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-obsidian transition-colors font-sans"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    <input 
                        required 
                        type="tel" 
                        placeholder="Phone (e.g., +92 300...)" 
                        className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-obsidian transition-colors font-sans"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                     <input 
                        required 
                        type="text" 
                        placeholder="Address" 
                        className="w-full bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-obsidian transition-colors font-sans"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                    <div className="flex gap-4">
                        <input 
                            required 
                            type="text" 
                            placeholder="City" 
                            className="w-2/3 bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-obsidian transition-colors font-sans"
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                        <input 
                            type="text" 
                            placeholder="Postcode" 
                            className="w-1/3 bg-transparent border-b border-stone-300 py-3 focus:outline-none focus:border-obsidian transition-colors font-sans"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-xs uppercase tracking-widest opacity-50 mb-6 font-sans">Payment</h2>
                <div className="space-y-4 font-sans">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-obsidian bg-white shadow-md' : 'border-stone-300 bg-white/50'}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'COD'} 
                            onChange={() => setPaymentMethod('COD')}
                            className="mr-3 accent-obsidian"
                        />
                        <span className="text-sm">Cash on Delivery</span>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'BankTransfer' ? 'border-obsidian bg-white shadow-md' : 'border-stone-300 bg-white/50'}`}>
                        <input 
                            type="radio" 
                            name="payment" 
                            checked={paymentMethod === 'BankTransfer'} 
                            onChange={() => setPaymentMethod('BankTransfer')}
                            className="mr-3 accent-obsidian"
                        />
                        <span className="text-sm">Bank Transfer</span>
                    </label>
                </div>

                {paymentMethod === 'BankTransfer' && (
                    <div className="bg-stone-50 p-6 text-sm space-y-2 border border-stone-200 mt-4 rounded-lg animate-fade-in font-sans">
                        <p className="font-bold">Bank Details</p>
                        <p>Account Title: <span className="opacity-80">Muhammad Sohaib Mushtaq</span></p>
                        <p>Bank: <span className="opacity-80">AlFalah</span></p>
                        <p>IBAN: <span className="opacity-80">PK21ALFH0570001010594265</span></p>
                        <div className="mt-4 pt-4 border-t border-stone-200">
                            <p className="text-red-900 font-medium">Instruction:</p>
                            <p className="opacity-70">Send a screenshot to the given number so we can confirm your order.</p>
                            <p className="font-mono mt-1">+92 307 9909749</p>
                        </div>
                    </div>
                )}
            </section>
        </form>

        {/* Right: Summary - New Design */}
        <div className="w-full flex justify-center md:block">
            <div className="master-container h-fit">
              {/* Card: Cart Items */}
              <div className="card cart">
                <label className="title">Your cart</label>
                <div className="products">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="product">
                      {/* Image/Icon */}
                      <div className="w-[60px] h-[60px] bg-stone-100 overflow-hidden rounded-md border border-stone-100">
                        <img src={item.images[0]} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      
                      {/* Info */}
                      <div className="product-info">
                        <span>{item.name}</span>
                        <p>Size: {item.selectedSize}</p>
                        <p>{item.category}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="quantity">
                        <button type="button" onClick={() => updateQuantity(item.id, item.selectedSize, -1)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <label>{item.quantity}</label>
                        <button type="button" onClick={() => updateQuantity(item.id, item.selectedSize, 1)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      
                      {/* Price */}
                      <label className="price small"><sup>PKR </sup>{(item.price * item.quantity).toLocaleString()}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card: Coupons */}
              <div className="card coupons">
                <label className="title">Apply coupons</label>
                <form className="form" onSubmit={handleApplyPromo}>
                    <input 
                        type="text" 
                        placeholder="Enter code" 
                        className="input_field" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit" className="btn-glass-dark w-full h-[40px] text-xs uppercase tracking-widest font-bold">Apply</button>
                </form>
                {error && <p className="text-red-500 text-xs px-5 pb-3 -mt-2 font-sans">{error}</p>}
                {discountPercent > 0 && <p className="text-green-700 text-xs px-5 pb-3 -mt-2 font-sans">Discount applied!</p>}
              </div>

              {/* Card: Checkout Totals */}
              <div className="card checkout">
                <label className="title">Order Summary</label>
                <div className="details">
                  <span>Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                  
                  <span>Discount</span>
                  <span>{discountPercent > 0 ? `- PKR ${discountAmount.toLocaleString()}` : '0'}</span>
                  
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'Free' : `PKR ${shippingFee}`}</span>
                </div>
                
                <div className="checkout--footer">
                  <label className="price"><sup>PKR </sup>{total.toLocaleString()}</label>
                  <button className="btn-glass-dark w-[140px] h-[42px] text-[11px] uppercase tracking-widest font-bold" form="checkout-form" type="submit">Place Order</button>
                </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;