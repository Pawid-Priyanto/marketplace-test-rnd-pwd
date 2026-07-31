import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Copy, CheckCheck } from 'lucide-react';
import {Button} from '../components/Button'

export function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || { id: 'INV-202660018', estimatedTime: '< 30 seconds' };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderData.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-lg w-full text-center space-y-6">
        
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
          <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payment Successful!</h1>
          <p className="text-sm text-gray-500">Thank you for your purchase. Your order is being processed.</p>
        </div>

        <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-100 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order ID</p>
              <p className="text-sm font-bold text-emerald-600 font-mono mt-0.5">{orderData.id}</p>
            </div>
            <Button 
              onClick={handleCopy}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 shadow-sm"
              title="Copy Order ID"
            >
              {copied ? <CheckCheck className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">Estimated Delivery</span>
            <span className="font-bold text-gray-900">{orderData.estimatedTime || '< 30 seconds'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            onClick={() => navigate('/marketplace')}
            className="py-3 px-4 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            Back to Marketplace
          </Button>
          <Button       
            onClick={() => navigate('/orders')}
            className="py-3 px-4 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            View Order History
          </Button>
        </div>

      </div>
    </div>
  );
}