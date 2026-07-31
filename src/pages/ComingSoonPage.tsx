import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Construction } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Construction className="h-8 w-8 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-gray-900">Feature Coming Soon</h1>
              <p className="text-sm text-gray-500">
                This page is currently under development and will be available soon.
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate('/')}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}