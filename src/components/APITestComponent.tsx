import React, { useState } from 'react';
import { testSMTPConnection, sendTestEmail, sendContactForm, checkAPIServer } from '../services/apiEmailService';

export const APITestComponent: React.FC = () => {
  const [testData, setTestData] = useState({
    to: 'info@wangareluxe.com',
    subject: 'API Test Email',
    message: 'This is a test email from WangarèLuxe API system.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<string>('');

  const handleCheckAPI = async () => {
    setIsLoading(true);
    setApiStatus('');

    try {
      const response = await checkAPIServer();
      if (response.status === 'OK') {
        setApiStatus('✅ API server is running!');
      } else {
        setApiStatus(`❌ API server error: ${response.message}`);
      }
    } catch (error) {
      setApiStatus(`❌ API server not reachable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('');

    try {
      const response = await testSMTPConnection();
      if (response.success) {
        setConnectionStatus('✅ SMTP connection successful!');
      } else {
        setConnectionStatus(`❌ Connection failed: ${response.error}`);
      }
    } catch (error) {
      setConnectionStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await sendTestEmail(
        testData.to,
        testData.subject,
        testData.message
      );
      
      if (response.success) {
        setResult('✅ Test email sent successfully!');
      } else {
        setResult(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestContactForm = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const response = await sendContactForm({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Contact Form',
        message: 'This is a test contact form submission.',
        phone: '+254 700 000 000'
      });
      
      if (response.success) {
        setResult('✅ Contact form test email sent successfully!');
      } else {
        setResult(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">API Email Testing</h3>
      
      {/* API Server Check */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium mb-2">1. Check API Server</h4>
        <p className="text-sm text-gray-600 mb-3">Verify that the backend API server is running.</p>
        <button
          onClick={handleCheckAPI}
          disabled={isLoading}
          className="btn btn-outline text-sm"
        >
          {isLoading ? 'Checking...' : 'Check API Server'}
        </button>
        {apiStatus && (
          <div className={`mt-2 p-2 rounded text-sm ${
            apiStatus.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {apiStatus}
          </div>
        )}
      </div>

      {/* Connection Test */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">2. Test SMTP Connection</h4>
        <p className="text-sm text-gray-600 mb-3">Verify that the SMTP connection to Gmail is working.</p>
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="btn btn-outline text-sm"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        {connectionStatus && (
          <div className={`mt-2 p-2 rounded text-sm ${
            connectionStatus.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {connectionStatus}
          </div>
        )}
      </div>

      {/* Test Email */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">3. Send Test Email</h4>
        <p className="text-sm text-gray-600 mb-3">Send a custom test email to verify email sending works.</p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">To Email:</label>
            <input
              type="email"
              value={testData.to}
              onChange={(e) => setTestData({...testData, to: e.target.value})}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="recipient@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Subject:</label>
            <input
              type="text"
              value={testData.subject}
              onChange={(e) => setTestData({...testData, subject: e.target.value})}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Email subject"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Message:</label>
            <textarea
              value={testData.message}
              onChange={(e) => setTestData({...testData, message: e.target.value})}
              className="w-full p-2 border rounded-md text-sm h-20"
              placeholder="Email message"
            />
          </div>
          
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className="btn btn-primary text-sm"
          >
            {isLoading ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>
      </div>

      {/* Contact Form Test */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">4. Test Contact Form Email</h4>
        <p className="text-sm text-gray-600 mb-3">Test the contact form email that customers will send to admin.</p>
        
        <button
          onClick={handleTestContactForm}
          disabled={isLoading}
          className="btn btn-outline text-sm"
        >
          {isLoading ? 'Sending...' : 'Send Contact Form Test'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`p-3 rounded-md ${
          result.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result}
        </div>
      )}

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">API Configuration</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>API URL:</strong> http://localhost:3001/api</p>
          <p><strong>SMTP Host:</strong> smtp.gmail.com</p>
          <p><strong>SMTP Port:</strong> 587</p>
          <p><strong>Email:</strong> info@wangareluxe.com</p>
          <p><strong>Status:</strong> Backend API with Gmail SMTP</p>
        </div>
      </div>
    </div>
  );
};
