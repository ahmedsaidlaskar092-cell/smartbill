
import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { Product, BillItem, PaymentMode, Bill } from '../types';
import InvoicePreview from '../components/InvoicePreview';

const Billing = () => {
    const { products, addBill, settings } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<BillItem[]>([]);
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
    const [discountValue, setDiscountValue] = useState(0);
    const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.CASH);
    const [showInvoice, setShowInvoice] = useState<Bill | null>(null);

    // Patient Details State
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [patientAge, setPatientAge] = useState<number | ''>('');
    const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [referringDoctor, setReferringDoctor] = useState('');


    const productsMap = useMemo(() => {
        return new Map(products.map(p => [p.id, p]));
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return [];
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return products.filter(p =>
            (p.name.toLowerCase().includes(lowerCaseSearchTerm) || p.id.toLowerCase().includes(lowerCaseSearchTerm)) && 
            (p.isService || p.stock > 0)
        );
    }, [searchTerm, products]);

    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product.id);
            if (existingItem) {
                 if (product.isService || existingItem.quantity < product.stock) {
                    return prevCart.map(item =>
                        item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                 }
                 alert(`Cannot add more ${product.name}. Only ${product.stock} in stock.`);
                 return prevCart;
            }
            return [{ productId: product.id, name: product.name, price: product.price, quantity: 1 }, ...prevCart];
        });
        setSearchTerm('');
    }, []);

    const updateQuantity = useCallback((productId: string, newQuantity: number) => {
        const product = productsMap.get(productId);
        
        if (newQuantity <= 0) {
            setCart(cart => cart.filter(item => item.productId !== productId));
            return;
        }

        if (product && !product.isService && newQuantity > product.stock) {
            alert(`Only ${product.stock} items available in stock.`);
            newQuantity = product.stock;
        }

        setCart(cart => cart.map(item =>
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        ));
    }, [productsMap]);
    
    const subTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
    
    const discountAmount = useMemo(() => {
        if (discountType === 'percentage') {
            return (subTotal * discountValue) / 100;
        }
        return discountValue;
    }, [subTotal, discountValue, discountType]);

    const grandTotal = subTotal - discountAmount;

    const handleSaveBill = () => {
        if (cart.length === 0) {
            alert("Cart is empty.");
            return;
        }
        const newBill = addBill({
            items: cart,
            subTotal,
            discount: discountAmount,
            grandTotal,
            paymentMode,
            patientName: patientName || undefined,
            patientPhone: patientPhone || undefined,
            patientAge: patientAge ? Number(patientAge) : undefined,
            patientGender: patientGender || undefined,
            referringDoctor: referringDoctor || undefined,
        });
        
        // Reset state
        setCart([]);
        setDiscountValue(0);
        setDiscountType('fixed');
        setPatientName('');
        setPatientPhone('');
        setPatientAge('');
        setPatientGender('Male');
        setReferringDoctor('');
        setPaymentMode(PaymentMode.CASH);
        
        setShowInvoice(newBill);
    };

    const commonInputStyles = "w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-200";

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-4rem)]">
            {showInvoice && <InvoicePreview bill={showInvoice} settings={settings} onClose={() => setShowInvoice(null)} />}
            
            <div className="lg:w-3/5 grow lg:grow-0 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col overflow-hidden">
                <h1 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-100 mb-4">Create Bill</h1>
                <div className="relative mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search products by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-12 text-lg border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    {searchTerm && (
                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                            {filteredProducts.map(p => (
                                <li key={p.id} onClick={() => addToCart(p)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{p.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Code: {p.id} | ₹{p.price.toFixed(2)}</p>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Stock: {p.isService ? 'N/A' : p.stock}</span>
                                </li>
                            ))}
                            {filteredProducts.length === 0 && <li className="p-3 text-gray-500 dark:text-gray-400 text-center">No products found.</li>}
                        </ul>
                    )}
                </div>

                <div className="mb-4 border-b dark:border-gray-700 pb-4">
                  <h2 className="text-lg font-bold font-display text-gray-700 dark:text-gray-200 mb-3">Patient & Doctor Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div>
                          <label htmlFor="patientName" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Patient Name</label>
                          <input id="patientName" type="text" placeholder="Enter patient's name" value={patientName} onChange={e => setPatientName(e.target.value)} className={commonInputStyles} />
                      </div>
                      <div>
                          <label htmlFor="patientPhone" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Patient Phone</label>
                          <input id="patientPhone" type="tel" placeholder="Enter patient's phone" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className={commonInputStyles} />
                      </div>
                      <div>
                          <label htmlFor="patientAge" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Age</label>
                          <input id="patientAge" type="number" placeholder="e.g., 35" value={patientAge} onChange={e => {
                              const ageValue = parseInt(e.target.value);
                              setPatientAge(isNaN(ageValue) ? '' : ageValue);
                          }} className={commonInputStyles} />
                      </div>
                      <div>
                          <label htmlFor="patientGender" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gender</label>
                          <select id="patientGender" value={patientGender} onChange={e => setPatientGender(e.target.value as 'Male' | 'Female' | 'Other')} className={commonInputStyles}>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                          </select>
                      </div>
                      <div className="md:col-span-2">
                          <label htmlFor="referringDoctor" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Referring Doctor</label>
                          <input id="referringDoctor" type="text" placeholder="e.g., Dr. Smith" value={referringDoctor} onChange={e => setReferringDoctor(e.target.value)} className={commonInputStyles} />
                      </div>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto -mx-6 px-6 py-2">
                    <h2 className="text-xl font-bold font-display text-gray-700 dark:text-gray-200 mb-3">Cart Items ({cart.length})</h2>
                    {cart.length === 0 ? (
                        <div className="text-center py-16">
                           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                           <p className="text-gray-500 dark:text-gray-400 mt-4">Your cart is empty.</p>
                           <p className="text-sm text-gray-400 dark:text-gray-500">Search for products to add them here.</p>
                        </div>
                    ) : (
                       <div className="space-y-3">
                           {cart.map(item => (
                               <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm">
                                   <div className="flex-1 mr-4">
                                       <p className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</p>
                                       <p className="text-sm text-gray-500 dark:text-gray-400">@ ₹{item.price.toFixed(2)}</p>
                                   </div>
                                   <div className="flex items-center gap-2">
                                       <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500">-</button>
                                       <input
                                          type="number"
                                          value={item.quantity}
                                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                          className="w-14 text-center border-0 bg-transparent font-semibold text-lg text-gray-800 dark:text-gray-100"
                                          min="1"
                                        />
                                       <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500">+</button>
                                   </div>
                                   <p className="w-24 text-right font-bold text-lg text-gray-800 dark:text-gray-100">₹{(item.price * item.quantity).toFixed(2)}</p>
                               </div>
                           ))}
                       </div>
                    )}
                </div>
            </div>

            <div className="lg:w-2/5 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-gray-100 mb-6">Summary</h2>
                    <div className="space-y-4 text-lg mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-100">₹{subTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                  <span className="text-gray-600 dark:text-gray-300 font-medium">Discount</span>
                                  <div className="inline-flex rounded-md shadow-sm" role="group">
                                      <button type="button" onClick={() => setDiscountType('fixed')} className={`px-3 py-1 text-sm font-medium rounded-l-lg border ${discountType === 'fixed' ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:border-gray-200 z-10' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'}`}>₹</button>
                                      <button type="button" onClick={() => setDiscountType('percentage')} className={`px-3 py-1 text-sm font-medium rounded-r-lg border -ml-px ${discountType === 'percentage' ? 'bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:border-gray-200 z-10' : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'}`}>%</button>
                                  </div>
                              </div>
                              <input
                                  type="number"
                                  value={discountValue || ''}
                                  onChange={(e) => setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                                  className="w-24 text-right border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100 rounded-md p-1 font-semibold focus:ring-gray-800 dark:focus:ring-gray-200 focus:border-gray-800 dark:focus:border-gray-200"
                                  placeholder="0"
                                  min="0"
                              />
                          </div>
                          {discountAmount > 0 && (
                              <div className="flex justify-end text-red-500 text-base mt-2">
                                  <span>- ₹{discountAmount.toFixed(2)}</span>
                              </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center text-3xl font-bold text-gray-900 dark:text-white border-t-2 border-dashed dark:border-gray-700 pt-4 mt-4">
                            <span>Grand Total</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Payment Mode</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <button onClick={() => setPaymentMode(PaymentMode.CASH)} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMode === PaymentMode.CASH ? 'border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">Cash</span>
                            </button>
                            <button onClick={() => setPaymentMode(PaymentMode.UPI)} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMode === PaymentMode.UPI ? 'border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">UPI</span>
                            </button>
                             <button onClick={() => setPaymentMode(PaymentMode.CARD)} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMode === PaymentMode.CARD ? 'border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                <span className="font-semibold text-gray-700 dark:text-gray-200">Card</span>
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSaveBill}
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white text-white py-4 rounded-lg shadow-lg text-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cart.length === 0}
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Save & Print Bill
                </button>
            </div>
        </div>
    );
};

export default Billing;
