
import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { PaymentMode } from '../types';

const Reports = () => {
    const { bills } = useData();
    const { theme } = useTheme();

    const chartData = useMemo(() => {
        const salesByDay = bills.reduce((acc, bill) => {
            const date = new Date(bill.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format
            acc[date] = (acc[date] || 0) + bill.grandTotal;
            return acc;
        }, {} as { [key: string]: number });

        return Object.keys(salesByDay)
            .sort()
            .map(date => ({
                name: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                sales: salesByDay[date],
            }));
    }, [bills]);

    const topProductsData = useMemo(() => {
        const productSales = bills.flatMap(bill => bill.items).reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }));
    }, [bills]);

    const paymentModeData = useMemo(() => {
      const counts = bills.reduce((acc, bill) => {
        acc[bill.paymentMode] = (acc[bill.paymentMode] || 0) + 1;
        return acc;
      }, {} as {[key in PaymentMode]: number});
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [bills]);

    const COLORS = {
      'Cash': '#10B981', // green-500
      'UPI': '#8B5CF6', // violet-500
      'Card': '#3B82F6' // blue-500
    };
    
    const tickColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';

    return (
        <div>
            <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-gray-100 mb-6">Reports</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100 mb-4">Daily Sales</h2>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'}/>
                                <XAxis dataKey="name" tick={{ fill: tickColor }} />
                                <YAxis tick={{ fill: tickColor }}/>
                                <Tooltip cursor={{fill: theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.5)'}} formatter={(value: number) => `₹${value.toFixed(2)}`} contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: theme === 'dark' ? '#1F2937' : '#FFFFFF', borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB' }} />
                                <Legend wrapperStyle={{ color: tickColor }} />
                                <Bar dataKey="sales" fill="#2979FF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-10 h-[350px] flex items-center justify-center">Not enough data to display sales chart.</p>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100 mb-4">Payment Methods</h2>
                    {paymentModeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={paymentModeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                      return (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14">
                                          {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                      );
                                    }}>
                                    {paymentModeData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: theme === 'dark' ? '#1F2937' : '#FFFFFF', borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB' }}/>
                                <Legend wrapperStyle={{ color: tickColor, bottom: '0px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-10 h-[350px] flex items-center justify-center">No payment data available.</p>
                    )}
                </div>

                <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold font-display text-gray-800 dark:text-gray-100 mb-4">Top 5 Selling Products/Services</h2>
                    {topProductsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'}/>
                                <XAxis type="number" tick={{ fill: tickColor }}/>
                                <YAxis type="category" dataKey="name" width={120} tick={{ width: 110, fill: tickColor }}/>
                                <Tooltip cursor={{fill: theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(229, 231, 235, 0.5)'}} contentStyle={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: theme === 'dark' ? '#1F2937' : '#FFFFFF', borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB' }}/>
                                <Legend wrapperStyle={{ color: tickColor }} />
                                <Bar dataKey="quantity" fill="#673AB7" radius={[0, 4, 4, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-10 h-[350px] flex items-center justify-center">No product sales data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;