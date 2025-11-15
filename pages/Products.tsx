import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const PRODUCTS_TO_LOAD = 20;

const Products = () => {
    const { products, deleteProduct } = useData();
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_TO_LOAD);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastProductElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleCount < products.length) {
                setVisibleCount(prev => prev + PRODUCTS_TO_LOAD);
            }
        });
        if (node) observer.current.observe(node);
    }, [visibleCount, products.length]);

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            deleteProduct(id);
        }
    };
    
    const currentProducts = products.slice(0, visibleCount);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-gray-100">Products</h1>
                <button
                    onClick={() => navigate('/products/new')}
                    className="flex items-center gap-2 bg-neon-blue text-white py-2 px-5 rounded-lg shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Product
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product, index) => {
                                const isLastElement = index === currentProducts.length - 1;
                                return (
                                    <tr ref={isLastElement ? lastProductElementRef : null} key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                        <td className="p-4 font-semibold text-gray-800 dark:text-gray-100">{product.name}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">₹{product.price.toFixed(2)}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{product.isService ? <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">SERVICE</span> : product.stock}</td>
                                        <td className="p-4 text-center">
                                          <div className="flex justify-center items-center gap-2">
                                            <button 
                                                onClick={() => navigate(`/products/edit/${product.id}`)}
                                                className="p-2 text-blue-500 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                                                aria-label="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 text-red-500 bg-red-100 dark:bg-red-500/20 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                                                aria-label="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                          </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No products found. Add one to get started!</p>}
                
                {visibleCount < products.length && (
                    <div className="text-center p-4 font-medium text-gray-500 dark:text-gray-400">
                        Loading more products...
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;