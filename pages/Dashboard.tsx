
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div className="ml-5">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const MemoizedStatCard = React.memo(StatCard);

const Dashboard = () => {
    const { products, bills } = useData();
    
    const totalRevenue = useMemo(() => bills.reduce((acc, bill) => acc + bill.grandTotal, 0), [bills]);
    
    const todayRevenue = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return bills
            .filter(bill => bill.date.startsWith(today))
            .reduce((acc, bill) => acc + bill.grandTotal, 0);
    }, [bills]);

    const iconColor = "bg-gradient-to-tr from-deep-purple to-neon-blue text-white shadow-lg";

    return (
        <div>
            <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-gray-100 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MemoizedStatCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toFixed(2)}`} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} 
                    color={iconColor}
                />
                <MemoizedStatCard 
                    title="Today's Revenue" 
                    value={`₹${todayRevenue.toFixed(2)}`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    color={iconColor}
                />
                <MemoizedStatCard 
                    title="Total Bills" 
                    value={bills.length} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                    color={iconColor}
                />
                <MemoizedStatCard 
                    title="Total Products" 
                    value={products.length} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                    color={iconColor}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100 mb-4">Recent Bills</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Invoice ID</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Items</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.slice(0, 5).map(bill => (
                                <tr key={bill.id} className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                    <td className="p-4 text-neon-blue font-semibold">{bill.id}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{new Date(bill.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300">{bill.items.length}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-100 text-right font-bold">₹{bill.grandTotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {bills.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No bills created yet.</p>}
            </div>
        </div>
    );
};

export default Dashboard;