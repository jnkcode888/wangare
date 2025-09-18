import React, { useState } from 'react';
import { EmailTemplateService } from '../services/emailTemplateService';

const EmailTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testOutboundEmail = async () => {
    setIsLoading(true);
    addResult('Testing outbound email (order confirmation)...');
    
    try {
      const result = await EmailTemplateService.sendOrderConfirmation({
        customer_name: 'Test Customer',
        customer_email: 'test@example.com',
        order_number: 'TEST-001',
        order_date: new Date().toLocaleDateString(),
        total_amount: 5000,
        items: [
          { name: 'Test Product', quantity: 1, price: 5000 }
        ],
        shipping_address: 'Test Address, Nairobi'
      });
      
      if (result.success) {
        addResult('✅ Outbound email sent successfully!');
      } else {
        addResult(`❌ Outbound email failed: ${result.error}`);
      }
    } catch (error) {
      addResult(`❌ Outbound email error: ${error}`);
    }
    
    setIsLoading(false);
  };

  const testInboundEmail = async () => {
    setIsLoading(true);
    addResult('Testing inbound email (contact form)...');
    
    try {
      const result = await EmailTemplateService.sendContactForm({
        name: 'Test Customer',
        email: 'test@example.com',
        subject: 'Test Contact Form',
        message: 'This is a test message from the email test component.',
        phone: '+254700000000'
      });
      
      if (result.success) {
        addResult('✅ Inbound email sent successfully!');
      } else {
        addResult(`❌ Inbound email failed: ${result.error}`);
      }
    } catch (error) {
      addResult(`❌ Inbound email error: ${error}`);
    }
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Email System Test</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testOutboundEmail}
            disabled={isLoading}
            className="btn btn-primary"
          >
            Test Outbound Email
          </button>
          
          <button
            onClick={testInboundEmail}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            Test Inbound Email
          </button>
          
          <button
            onClick={clearResults}
            className="btn btn-outline"
          >
            Clear Results
          </button>
        </div>
        
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
            <p className="mt-2 text-gray-600">Testing email...</p>
          </div>
        )}
        
        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Create two services in EmailJS: <code>outbound_service</code> and <code>inbound_service</code></li>
          <li>2. Create two templates: <code>outbound_template</code> and <code>inbound_template</code></li>
          <li>3. Update your environment variables with the new public keys</li>
          <li>4. Test both outbound and inbound emails using the buttons above</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailTestComponent;
