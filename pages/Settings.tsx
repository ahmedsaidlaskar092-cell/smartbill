
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Settings as SettingsType } from '../types';

const Settings = () => {
    const { settings, updateSettings } = useData();
    const [formState, setFormState] = useState<SettingsType>(settings);
    const [logoPreview, setLogoPreview] = useState<string>(settings.logo);

    useEffect(() => {
        setFormState(settings);
        setLogoPreview(settings.logo);
    }, [settings]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormState(prev => ({ ...prev, logo: base64String }));
                setLogoPreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formState);
        alert('Settings saved successfully!');
    };
    
    const inputClass = "mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";


    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold font-display text-gray-800 dark:text-gray-100 mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="shopName" className={labelClass}>Shop Name</label>
                        <input type="text" id="shopName" name="shopName" value={formState.shopName} onChange={handleChange} className={inputClass}/>
                    </div>
                    <div>
                        <label htmlFor="address" className={labelClass}>Address</label>
                        <input type="text" id="address" name="address" value={formState.address} onChange={handleChange} className={inputClass}/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label htmlFor="phone" className={labelClass}>Phone Number</label>
                          <input type="tel" id="phone" name="phone" value={formState.phone || ''} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                          <label htmlFor="gstin" className={labelClass}>GSTIN</label>
                          <input type="text" id="gstin" name="gstin" value={formState.gstin || ''} onChange={handleChange} className={inputClass}/>
                      </div>
                    </div>
                     <div>
                        <label htmlFor="upiId" className={labelClass}>UPI ID</label>
                        <input type="text" id="upiId" name="upiId" value={formState.upiId} onChange={handleChange} className={inputClass}/>
                    </div>
                    <div>
                        <label htmlFor="printSize" className={labelClass}>Default Print Size</label>
                        <select id="printSize" name="printSize" value={formState.printSize || '80mm'} onChange={handleChange} className={inputClass}>
                            <option value="58mm">58mm (Receipt)</option>
                            <option value="80mm">80mm (Receipt)</option>
                            <option value="A4">A4 (Full Page)</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Shop Logo</label>
                        <div className="mt-2 flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-md" />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-neon-blue hover:file:bg-blue-200 dark:file:bg-blue-500/20 dark:file:text-blue-300 dark:hover:file:bg-blue-500/30 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-neon-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-blue transition-all"
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;