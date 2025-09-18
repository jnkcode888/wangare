import React, { useState, useEffect } from 'react';
import { SettingsIcon, SaveIcon, TestTubeIcon, CheckIcon, XIcon } from 'lucide-react';

interface EmailTemplateConfigProps {
  onSave: (config: EmailJSConfig) => void;
  initialConfig?: EmailJSConfig;
}

interface EmailJSConfig {
  serviceId: string;
  publicKey: string;
  templates: {
    orderConfirmation: string;
    paymentConfirmed: string;
    paymentFailed: string;
    orderShipped: string;
    orderDelivered: string;
    welcome: string;
    passwordReset: string;
    newsletter: string;
    contactForm: string;
    adminNotification: string;
  };
}

const EmailTemplateConfig: React.FC<EmailTemplateConfigProps> = ({ onSave, initialConfig }) => {
  const [config, setConfig] = useState<EmailJSConfig>({
    serviceId: '',
    publicKey: '',
    templates: {
      orderConfirmation: 'template_order_confirmation',
      paymentConfirmed: 'template_payment_confirmed',
      paymentFailed: 'template_payment_failed',
      orderShipped: 'template_order_shipped',
      orderDelivered: 'template_order_delivered',
      welcome: 'template_welcome',
      passwordReset: 'template_password_reset',
      newsletter: 'template_newsletter',
      contactForm: 'template_contact_form',
      adminNotification: 'template_admin_notification'
    }
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any> || {}),
          [child]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    onSave(config);
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Test EmailJS connection
      const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: config.templates.orderConfirmation,
          user_id: config.publicKey,
          template_params: {
            to_name: 'Test User',
            to_email: 'test@example.com',
            order_number: 'TEST-001',
            order_date: new Date().toLocaleDateString(),
            total_amount: '0.00',
            items: 'Test Item',
            shipping_address: 'Test Address'
          }
        })
      });

      if (response.ok) {
        setTestResult({ success: true, message: 'Connection test successful!' });
      } else {
        setTestResult({ success: false, message: 'Connection test failed. Please check your credentials.' });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-gold" />
        <h2 className="font-serif text-2xl">EmailJS Configuration</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Service Configuration */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Service Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service ID
              </label>
              <input
                type="text"
                value={config.serviceId}
                onChange={(e) => handleInputChange('serviceId', e.target.value)}
                placeholder="your_service_id_here"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from your EmailJS dashboard
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public Key
              </label>
              <input
                type="text"
                value={config.publicKey}
                onChange={(e) => handleInputChange('publicKey', e.target.value)}
                placeholder="your_public_key_here"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from your EmailJS dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Template IDs */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Template IDs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Confirmation
              </label>
              <input
                type="text"
                value={config.templates.orderConfirmation}
                onChange={(e) => handleInputChange('templates.orderConfirmation', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Confirmed
              </label>
              <input
                type="text"
                value={config.templates.paymentConfirmed}
                onChange={(e) => handleInputChange('templates.paymentConfirmed', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Failed
              </label>
              <input
                type="text"
                value={config.templates.paymentFailed}
                onChange={(e) => handleInputChange('templates.paymentFailed', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Shipped
              </label>
              <input
                type="text"
                value={config.templates.orderShipped}
                onChange={(e) => handleInputChange('templates.orderShipped', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Delivered
              </label>
              <input
                type="text"
                value={config.templates.orderDelivered}
                onChange={(e) => handleInputChange('templates.orderDelivered', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Email
              </label>
              <input
                type="text"
                value={config.templates.welcome}
                onChange={(e) => handleInputChange('templates.welcome', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Reset
              </label>
              <input
                type="text"
                value={config.templates.passwordReset}
                onChange={(e) => handleInputChange('templates.passwordReset', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsletter
              </label>
              <input
                type="text"
                value={config.templates.newsletter}
                onChange={(e) => handleInputChange('templates.newsletter', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Form
              </label>
              <input
                type="text"
                value={config.templates.contactForm}
                onChange={(e) => handleInputChange('templates.contactForm', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notification
              </label>
              <input
                type="text"
                value={config.templates.adminNotification}
                onChange={(e) => handleInputChange('templates.adminNotification', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Test Connection</h4>
              <p className="text-sm text-gray-600">Test your EmailJS configuration</p>
            </div>
            <button
              onClick={testConnection}
              disabled={testing || !config.serviceId || !config.publicKey}
              className="btn btn-outline flex items-center gap-2"
            >
              <TestTubeIcon className="h-4 w-4" />
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          {testResult && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              testResult.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {testResult.success ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <XIcon className="h-4 w-4" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="border-t pt-4">
          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateConfig;
