
import React, { useRef, useState, useEffect } from 'react';
import { Bill, Settings } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
  bill: Bill;
  settings: Settings;
  onClose: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ bill, settings, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [printClass, setPrintClass] = useState('');
  const [selectedPrintSize, setSelectedPrintSize] = useState<'58mm' | '80mm' | 'A4'>(settings.printSize);
  const [qrCodeValue, setQrCodeValue] = useState('');

  // The QRCode component is loaded from a script in index.html and attached to the window object.
  // We need to access it from there to use it in this component.
  const QRCode = (window as any).QRCode;

  useEffect(() => {
    // Set the default print size from settings when the component mounts or settings change
    setSelectedPrintSize(settings.printSize || '80mm');
  }, [settings.printSize]);

  useEffect(() => {
    if (settings.upiId && bill.grandTotal > 0) {
      const upiUrl = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.shopName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR&tn=Bill%20Payment%20${bill.id}`;
      setQrCodeValue(upiUrl);
    }
  }, [settings.upiId, bill.grandTotal, settings.shopName, bill.id]);

  const handlePrint = () => {
    const sizeClass = `print-${selectedPrintSize.toLowerCase()}`;
    setPrintClass(sizeClass);
    setTimeout(() => {
      window.print();
      setPrintClass('');
    }, 100);
  };
  
  const handleDownloadPdf = () => {
    if (invoiceRef.current) {
        html2canvas(invoiceRef.current, { scale: 2, backgroundColor: '#ffffff' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${bill.id}.pdf`);
        });
    }
  };

  const handleWhatsAppShare = () => {
    const itemsText = bill.items.map(item => `${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');
    const message = `
*Invoice from ${settings.shopName}*
-----------------------------------
Invoice ID: *${bill.id}*
Date: ${new Date(bill.date).toLocaleString()}
Patient: ${bill.patientName || 'N/A'}
-----------------------------------
*Items:*
${itemsText}
-----------------------------------
Subtotal: ₹${bill.subTotal.toFixed(2)}
Discount: - ₹${bill.discount.toFixed(2)}
*Grand Total: ₹${bill.grandTotal.toFixed(2)}*
-----------------------------------
Payment Mode: *${bill.paymentMode}*

Thank you for your visit!
    `;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const primaryButtonStyles = "inline-flex items-center gap-2 py-2 px-4 text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 dark:focus:ring-gray-200 rounded-lg transition-colors";
  const secondaryButtonStyles = "inline-flex items-center gap-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center no-print">
          <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100">Invoice Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-3xl font-light">&times;</button>
        </div>
        
        <div className="overflow-y-auto p-4 sm:p-6 flex-grow">
          <div id="invoice-preview" ref={invoiceRef} className={`bg-white text-black p-8 mx-auto shadow-lg rounded-lg ${printClass}`}>
            <header className="flex justify-between items-center border-b pb-4 mb-6">
              <div className="flex items-center gap-4">
                {settings.logo && <img src={settings.logo} alt="Shop Logo" className="h-16 w-16 object-contain rounded-full border p-1"/>}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-display">{settings.shopName}</h1>
                  <p className="text-xs text-gray-500">{settings.address}</p>
                  {settings.phone && <p className="text-xs text-gray-500">Phone: {settings.phone}</p>}
                  {settings.gstin && <p className="text-xs text-gray-500">GSTIN: {settings.gstin}</p>}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold uppercase text-gray-600">Invoice</h2>
                <p className="text-xs text-gray-500"><strong>ID:</strong> {bill.id}</p>
                <p className="text-xs text-gray-500"><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 border-b pb-4 mb-6 text-sm">
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Details</h3>
                    <p className="font-bold text-gray-800">{bill.patientName || 'Walk-in Patient'}</p>
                    {bill.patientPhone && <p className="text-gray-600">{bill.patientPhone}</p>}
                </div>
                <div className="text-right">
                    {(bill.patientAge || bill.patientGender) && (
                        <>
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Age / Gender</h3>
                          <p className="text-gray-800">
                            {bill.patientAge || 'N/A'} / {bill.patientGender || 'N/A'}
                          </p>
                        </>
                    )}
                </div>
                {bill.referringDoctor && (
                  <div className="col-span-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred By</h3>
                      <p className="font-bold text-gray-800">Dr. {bill.referringDoctor}</p>
                  </div>
                )}
            </div>

            <table className="w-full text-left mb-6 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 font-semibold text-gray-600 rounded-l-lg">#</th>
                  <th className="p-3 font-semibold text-gray-600">ITEM</th>
                  <th className="p-3 text-center font-semibold text-gray-600">QTY</th>
                  <th className="p-3 text-right font-semibold text-gray-600">PRICE</th>
                  <th className="p-3 text-right font-semibold text-gray-600 rounded-r-lg">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={item.productId} className="border-b">
                    <td className="p-3 text-gray-500">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-800">{item.name}</td>
                    <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="p-3 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                    <td className="p-3 text-right font-medium text-gray-800">₹{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-between items-start">
              <div className="text-center">
                 {qrCodeValue && QRCode && (
                  <>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Scan to Pay via UPI</p>
                    <div className="bg-white p-2 border rounded-lg inline-block">
                        <QRCode value={qrCodeValue} size={80} level={"H"} />
                    </div>
                  </>
                 )}
              </div>
              <div className="w-full max-w-xs text-sm">
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{bill.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-red-500">
                  <span>Discount:</span>
                  <span>- ₹{bill.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base py-2 border-t-2 mt-2 border-gray-200 text-gray-800">
                  <span>Grand Total:</span>
                  <span>₹{bill.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

             <div className="text-center mt-8 text-xs text-gray-500 border-t pt-4">
                <p>Payment Mode: <strong>{bill.paymentMode}</strong></p>
                <p className="mt-4 italic">This is a computer-generated invoice and does not require a signature.</p>
                <p>Thank you for your visit!</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800/50 border-t dark:border-gray-700 rounded-b-xl flex flex-wrap justify-center sm:justify-end gap-3 no-print">
            <div className="flex items-center gap-2">
                <label htmlFor="print-size-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">Print Size:</label>
                <select
                    id="print-size-select"
                    value={selectedPrintSize}
                    onChange={(e) => setSelectedPrintSize(e.target.value as '58mm' | '80mm' | 'A4')}
                    className="py-2 pl-3 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                    <option value="58mm">58mm</option>
                    <option value="80mm">80mm</option>
                    <option value="A4">A4</option>
                </select>
            </div>
            <button
                onClick={handlePrint}
                className={primaryButtonStyles}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print
            </button>
            <button onClick={handleDownloadPdf} className={secondaryButtonStyles}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF
            </button>
            <button onClick={handleWhatsAppShare} className={secondaryButtonStyles}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                Share
            </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
