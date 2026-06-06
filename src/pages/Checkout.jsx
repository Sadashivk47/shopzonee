import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Truck, CreditCard, Smartphone, Lock, Loader2, ArrowRight } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, totalPrice, clearCart, currentUser } = useCart();
  const navigate = useNavigate();

  // Form Inputs - Prepopulate dynamically if logged in
  const [fullName, setFullName] = useState(() => currentUser?.name || 'John Doe');
  const [email, setEmail] = useState(() => currentUser?.email || 'john@example.com');
  const [address, setAddress] = useState('123 Modern Street');
  const [city, setCity] = useState('Mumbai');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('400001');

  // Checkout states
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Stripe Hands-On Handshake configurations
  const [stripeSecret, setStripeSecret] = useState('');
  const [stripeMode, setStripeMode] = useState(''); // 'live-stripe' or 'sandbox-simulation'
  const [stripeMessage, setStripeMessage] = useState('');
  const [stripeError, setStripeError] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showIndianStripeInfo, setShowIndianStripeInfo] = useState(true);

  // Stripe Simulated Inputs
  const [cardholderName, setCardholderName] = useState(() => currentUser?.name || 'John Doe');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  // Calculations
  const shippingCharge = 0; // Free
  const gstRate = 0.18; // 18% as template mock-up
  const computedGst = parseFloat((totalPrice * gstRate).toFixed(2));
  const estimatedTotal = parseFloat((totalPrice + shippingCharge + computedGst).toFixed(2));

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStripeError('');
    setOtpError('');

    try {
      // Step 1: Initiate PaymentIntent generation request via our custom Express backend API
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: estimatedTotal, currency: 'INR' })
      });

      if (!response.ok) {
        throw new Error('Could not establish secure payment handshake with API gateway.');
      }

      const data = await response.json();
      setStripeSecret(data.clientSecret);
      setStripeMode(data.mode);
      setStripeMessage(data.message);

      // Secure payment transit delay
      await new Promise(resolve => setTimeout(resolve, 1400));

      // With Stripe India domestic rules, RBI mandates Multi-Factor OTP challenges (3D Secure).
      // We will present the security OTP interface challenge immediately!
      setIsProcessing(false);
      setShowOtpVerification(true);
    } catch (err) {
      setStripeError(err.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setOtpError('');

    // Simulated SMS/banking OTP delay handshake
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Allow user to enter any 4-Digit/6-Digit code or leave empty for sandbox
    if (otpCode !== '1234' && otpCode !== '123456' && otpCode.trim() !== '') {
      setOtpError('Incorrect simulated authentication code. Try entering "1234" (our test OTP token) or clear the field to proceed.');
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
      setShowOtpVerification(false);
      setIsOrdered(true);
      setOrderId('SZ-' + Math.floor(Math.random() * 900000 + 100000));
      clearCart(); // Auto-clean global state cart
    }
  };

  if (isOrdered) {
    return (
      <div className="bg-slate-50/50 min-h-screen pt-24 pb-32 flex flex-col justify-center items-center px-6 font-sans">
        <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-3xl max-w-xl w-full text-center shadow-2xl shadow-slate-100">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 stroke-[2]" />
          </div>
          
          <span className="text-emerald-500 font-extrabold uppercase text-[10.5px] tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full mb-3 inline-block border border-emerald-100">
            Payment Completed
          </span>
          
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-4">
            Order Placed Successfully!
          </h2>
          
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            Thank you for purchasing at <span className="font-semibold text-slate-800">ShopZone</span>, {fullName.split(' ')[0] || 'valued customer'}.
            <span className="block my-3 text-slate-900 font-semibold text-base py-2.5 px-4 bg-slate-50 border border-slate-155 rounded-2xl max-w-sm mx-auto">
              Your order ID is <span className="font-mono text-slate-950 font-extrabold">{orderId}</span>
            </span>
            A receipt has been sent to <span className="font-semibold text-slate-800">{email}</span>.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-105 mb-8 max-w-md mx-auto text-left space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Coordinates</h4>
            <div className="grid grid-cols-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Recipient:</span>
              <span className="font-bold text-slate-800 text-right">{fullName}</span>
              <span className="font-medium text-slate-400">Destination:</span>
              <span className="font-bold text-slate-800 text-right">{address}, {city}</span>
              <span className="font-medium text-slate-400">ZIP Code:</span>
              <span className="font-bold text-slate-800 text-right font-mono">{pinCode}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="bg-slate-950 text-[#D4FC79] hover:bg-slate-900 font-bold py-4 px-8 rounded-xl transition-all shadow-sm hover:-translate-y-0.5 text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-24 pb-32">
      <main className="max-w-7xl mx-auto px-6 font-sans">
        
        {/* Step Progress indicators */}
        <div className="mb-10 flex items-center justify-start max-w-lg">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center justify-center border border-slate-205">1</span>
              <span className="text-xs font-bold text-slate-400">Cart</span>
            </div>
            <div className="w-12 h-px bg-slate-200 mx-3"></div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#D4FC79] text-[11px] font-bold flex items-center justify-center shadow-xs">2</span>
              <span className="text-xs font-extrabold text-slate-900">Details &amp; Shipping</span>
            </div>
            <div className="w-12 h-px bg-slate-200 mx-3"></div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center">3</span>
              <span className="text-xs font-bold text-slate-400">Invoice</span>
            </div>
          </div>
        </div>

        {/* Content Checkout Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Details & Shipping addresses */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handlePaymentSubmit}>
              
              {/* Shipping Blocks */}
              <div className="bg-white border border-slate-150/55 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-slate-800" />
                  <span>Shipping Details</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 focus:border-slate-950 outline-none transition-all placeholder:text-slate-350"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 focus:border-slate-950 outline-none transition-all placeholder:text-slate-350"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Shipping Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 focus:border-slate-950 outline-none transition-all placeholder:text-slate-350"
                      placeholder="123 Modern Street"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 focus:border-slate-950 outline-none transition-all placeholder:text-slate-350"
                        placeholder="Mumbai"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">State</label>
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 focus:border-slate-950 outline-none transition-all"
                      >
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 focus:border-slate-950 outline-none transition-all placeholder:text-slate-350"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods selector block */}
              <div className="bg-white border border-slate-150/55 rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-950 mb-6 flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-slate-800" />
                  <span>Payment Method</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`relative flex items-center gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all duration-300 ${
                      paymentMethod === 'card'
                        ? 'border-slate-950 bg-slate-50 shadow-xs'
                        : 'border-slate-150 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-option"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-slate-950 focus:ring-0 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">Card Payment</span>
                      <span className="text-[10.5px] text-slate-400">Debit/Credit Card</span>
                    </div>
                    <CreditCard className="ml-auto w-5 h-5 text-slate-500" />
                  </label>

                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`relative flex items-center gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all duration-300 ${
                      paymentMethod === 'upi'
                        ? 'border-slate-950 bg-slate-50 shadow-xs'
                        : 'border-slate-150 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-option"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-slate-950 focus:ring-0 w-4 h-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">UPI Payment</span>
                      <span className="text-[10.5px] text-slate-400">GPay, PhonePe, UPI ID</span>
                    </div>
                    <Smartphone className="ml-auto w-5 h-5 text-slate-500" />
                  </label>
                </div>

                {/* Conditional fields card */}
                {showOtpVerification ? (
                  <div className="space-y-4 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 animate-fadeIn">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                        <span className="font-mono text-[10px] font-bold text-slate-400 tracking-wider uppercase">SECURE 3D GATEWAY CHALLENGE</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {stripeSecret ? stripeSecret.slice(0, 15) + '...' : 'Simulated'}</span>
                    </div>

                    <div className="space-y-2 text-center py-4">
                      <p className="text-xs text-slate-350">A secure simulated SMS authentication code was dispatched by the issuer bank to your mobile device.</p>
                      <p className="text-xl font-extrabold tracking-tight text-[#D4FC79] mt-1">₹{estimatedTotal.toLocaleString()}</p>
                      <p className="text-[10.5px] text-slate-400 font-medium">Recipient: <span className="text-white font-semibold">ShopZone Enterprise</span></p>
                    </div>

                    {otpError && (
                      <div className="p-3 bg-red-950/50 border border-red-900 rounded-xl text-red-300 text-xs font-medium">
                        {otpError}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">Enter OTP SMS Token</label>
                        <input
                          type="text"
                          required
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleVerifyOtp(e);
                            }
                          }}
                          placeholder="e.g. 1234 (our default test code)"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-center tracking-widest text-[#D4FC79] focus:ring-2 focus:ring-slate-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpCode('1234');
                            setOtpError('');
                          }}
                          className="py-2.5 px-3 bg-slate-800 border border-slate-700 hover:bg-slate-705 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
                        >
                          Use Demo OTP (1234)
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isProcessing}
                          className="py-2.5 px-3 bg-[#D4FC79] hover:bg-[#cbf768] text-slate-950 font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>Verify Code &amp; Pay</span>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-500 text-center font-mono">
                      <span>SECURED BY MOCK STRIPE GATEWAY SHIELD</span>
                    </div>
                  </div>
                ) : paymentMethod === 'card' ? (
                  <div className="space-y-4 p-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cardholder Name</label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-100 focus:border-slate-950 outline-none placeholder:text-slate-350"
                        placeholder="Full name as on card"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required={paymentMethod === 'card'}
                          value={cardNumber}
                          onChange={(e) => {
                            // Simple auto-formatting space helper
                            const val = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                            setCardNumber(val.slice(0, 19));
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-150 focus:border-slate-950 outline-none placeholder:text-slate-350 font-mono"
                          placeholder="4242 4242 4242 4242"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Expiry Date</label>
                        <input
                          type="text"
                          required={paymentMethod === 'card'}
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) {
                              val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            }
                            setCardExpiry(val.slice(0, 5));
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-100 outline-none placeholder:text-slate-350 font-mono"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          required={paymentMethod === 'card'}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-2 focus:ring-slate-105 outline-none placeholder:text-slate-350 font-mono"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 space-y-2">
                    <p className="text-xs font-semibold">Immediate Unified Payment Interface (UPI) Prompt</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Enter your virtual payment address (VPA) below (e.g. name@okhdfc), or select Complete Order to trigger simulated scanning flow.
                    </p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full mt-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-slate-100 focus:border-slate-950 outline-none font-semibold text-slate-800 placeholder:text-slate-350"
                      placeholder="e.g. username@upi"
                    />
                  </div>
                )}

                {/* Educational Drawer: Stripe India Merchant Regulations */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <div 
                    onClick={() => setShowIndianStripeInfo(!showIndianStripeInfo)}
                    className="flex justify-between items-center cursor-pointer text-[11px] font-bold text-slate-500 hover:text-slate-800 select-none"
                  >
                    <span>ℹ️ STRIPE INTEGRATION FOR INDIAN MERCHANTS</span>
                    <span className="text-xs text-slate-400 font-mono">{showIndianStripeInfo ? '[- Collapse]' : '[+ Expand Guide]'}</span>
                  </div>

                  {showIndianStripeInfo && (
                    <div className="mt-2.5 text-slate-500 leading-normal text-[10.5px] space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-left">
                      <p>
                        Stripe is fully functional in India, operating under strict regulations governed by the <strong>Reserve Bank of India (RBI)</strong>:
                      </p>
                      <p>
                        <strong>1. Mandatory 3DS (OTP verification):</strong> Direct silent charges without customer authentication are illegal. All payments must transition through banking OTP prompts.
                      </p>
                      <p>
                        <strong>2. Current Individual Pause:</strong> As of recent updates, Stripe has temporarily adjusted new onboardings for individual merchants in India to invite-only. Registered private companies with GSTIN paperwork can still integrate.
                      </p>
                      <p>
                        <strong>3. Local Currency Setup:</strong> Our system simulates this cycle securely: generating Stripe <code>PaymentIntents</code> at our API node, transitioning token secrets back, and validating banking OTP challenges natively!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action completion button inside left form */}
              {!showOtpVerification && (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-slate-950 text-[#D4FC79] py-4 rounded-xl font-extrabold text-sm hover:bg-slate-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 select-none cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Initiating Stripe Verification...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{estimatedTotal.toLocaleString()} via Secured Stripe Card</span>
                      <Lock className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Right Column: Mini Cart items check */}
          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-white border border-slate-150/50 rounded-3xl p-6 shadow-sm shadow-slate-100">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                Review Your Order
              </h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-slate-50/60 pb-3 last:border-0 last:pb-0">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow font-sans min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate leading-tight">{item.title}</p>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 font-medium">Qty: {item.quantity}</p>
                      <p className="text-xs font-bold text-slate-950 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 pt-6 border-t border-slate-100 text-sm text-slate-500 font-sans">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Shipping</span>
                  <span className="text-slate-950 font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-md text-xs">FREE</span>
                </div>
                <div className="flex justify-between font-medium pb-4 border-b border-slate-50">
                  <span>Est. Tax (GST 18%)</span>
                  <span className="font-bold text-slate-800">₹{computedGst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-xs font-extrabold text-slate-900 uppercase">Total Amount</span>
                  <span className="text-2xl font-extrabold text-slate-950 tracking-tight">
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
