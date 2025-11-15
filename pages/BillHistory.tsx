
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Bill } from '../types';
import InvoicePreview from '../components/InvoicePreview';

const BillHistory = () => {
    const { bills, settings } = useData();
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 10;

    const indexOfLastBill = currentPage * billsPerPage;
    const indexOfFirstBill = indexOfLastBill - billsPerPage;
    const currentBills = bills.slice(indexOfFirstBill, indexOfLastBill);
    const totalPages = Math.ceil(bills.length / billsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            {selectedBill && <InvoicePreview bill={selectedBill} settings={settings} onClose={() => setSelectedBill(null)} />}
            
            <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-gray-100 mb-6">Bill History</h1>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Invoice ID</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Patient Name</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Items</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Payment</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBills.map(bill => (
                                <tr key={bill.id} className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                    <td className="p-4 text-neon-blue font-semibold">{bill.id}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{new Date(bill.date).toLocaleString()}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{bill.patientName || 'Walk-in'}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300 text-center">{bill.items.length}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        bill.paymentMode === 'Cash' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                                        : bill.paymentMode === 'UPI' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' 
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>{bill.paymentMode}</span>
                                    </td>
                                    <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-bold">₹{bill.grandTotal.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => setSelectedBill(bill)}
                                            className="p-2 text-deep-purple bg-purple-100 dark:bg-purple-500/20 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors"
                                            aria-label="View Bill"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {bills.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No bills found in history.</p>}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === number ? 'bg-neon-blue text-white shadow' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillHistory;