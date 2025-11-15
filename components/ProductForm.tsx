
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Product } from '../types';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById } = useData();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isService, setIsService] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const product = getProductById(id);
      if (product) {
        setName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setIsService(product.isService || false);
      }
    }
  }, [id, isEditing, getProductById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || stock < 0) {
      alert('Please fill all fields correctly.');
      return;
    }
    
    const productData = { name, price, stock, isService };
    if (isEditing && id) {
      updateProduct({ ...productData, id });
    } else {
      addProduct(productData);
    }
    navigate('/products');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-gray-100 mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
              required
              placeholder="e.g., X-Ray Chest PA"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                required
                min="0.01"
                step="0.01"
                placeholder="e.g., 400"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                required
                min="0"
                disabled={isService}
                placeholder="e.g., 100"
              />
            </div>
          </div>
          <div className="pt-2">
            <label htmlFor="isService" className="flex items-center cursor-pointer bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="checkbox"
                id="isService"
                checked={isService}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsService(checked);
                  if (checked) {
                    setStock(0);
                  }
                }}
                className="h-5 w-5 text-neon-blue focus:ring-neon-blue border-gray-300 dark:border-gray-500 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">This is a Service (Does not have stock)</span>
            </label>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="py-2 px-5 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-purple transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-neon-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue transition-all"
            >
              {isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;