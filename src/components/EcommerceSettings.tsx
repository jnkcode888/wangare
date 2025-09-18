import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  TruckIcon, 
  ReceiptIcon, 
  SettingsIcon, 
  SaveIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'mpesa' | 'stripe' | 'paypal' | 'bank_transfer' | 'cash';
  enabled: boolean;
  credentials: Record<string, string>;
  fees: {
    fixed: number;
    percentage: number;
  };
  currency: string;
  testMode: boolean;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  freeThreshold?: number;
  estimatedDays: string;
  enabled: boolean;
  zones: string[];
}

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  enabled: boolean;
  appliesTo: string[];
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  enabled: boolean;
}

const EcommerceSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payment' | 'shipping' | 'tax' | 'currency'>('payment');
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock data - in production, this would come from your API
  useEffect(() => {
    const mockPaymentGateways: PaymentGateway[] = [
      {
        id: '1',
        name: 'M-Pesa',
        type: 'mpesa',
        enabled: true,
        credentials: {
          consumerKey: 'your_consumer_key',
          consumerSecret: 'your_consumer_secret',
          shortcode: '174379',
          passkey: 'your_passkey'
        },
        fees: {
          fixed: 0,
          percentage: 0
        },
        currency: 'KES',
        testMode: true
      },
      {
        id: '2',
        name: 'Stripe',
        type: 'stripe',
        enabled: false,
        credentials: {
          publishableKey: 'pk_test_...',
          secretKey: 'sk_test_...',
          webhookSecret: 'whsec_...'
        },
        fees: {
          fixed: 0,
          percentage: 2.9
        },
        currency: 'KES',
        testMode: true
      }
    ];

    const mockShippingOptions: ShippingOption[] = [
      {
        id: '1',
        name: 'Standard Shipping',
        description: 'Regular delivery within 5-7 business days',
        cost: 500,
        freeThreshold: 10000,
        estimatedDays: '5-7',
        enabled: true,
        zones: ['Nairobi', 'Mombasa', 'Kisumu']
      },
      {
        id: '2',
        name: 'Express Shipping',
        description: 'Fast delivery within 2-3 business days',
        cost: 1500,
        freeThreshold: 25000,
        estimatedDays: '2-3',
        enabled: true,
        zones: ['Nairobi', 'Mombasa']
      },
      {
        id: '3',
        name: 'Same Day Delivery',
        description: 'Delivery on the same day (Nairobi only)',
        cost: 3000,
        estimatedDays: 'Same day',
        enabled: true,
        zones: ['Nairobi']
      }
    ];

    const mockTaxRates: TaxRate[] = [
      {
        id: '1',
        name: 'VAT',
        rate: 16,
        type: 'percentage',
        enabled: true,
        appliesTo: ['all']
      },
      {
        id: '2',
        name: 'Import Duty',
        rate: 10,
        type: 'percentage',
        enabled: false,
        appliesTo: ['imported_items']
      }
    ];

    const mockCurrencies: Currency[] = [
      {
        code: 'KES',
        name: 'Kenyan Shilling',
        symbol: 'KSh',
        rate: 1,
        enabled: true
      },
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        rate: 0.0067,
        enabled: false
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        rate: 0.0062,
        enabled: false
      }
    ];

    setPaymentGateways(mockPaymentGateways);
    setShippingOptions(mockShippingOptions);
    setTaxRates(mockTaxRates);
    setCurrencies(mockCurrencies);
    setLoading(false);
  }, []);

  const toggleGateway = (id: string) => {
    setPaymentGateways(prev => 
      prev.map(gateway => 
        gateway.id === id 
          ? { ...gateway, enabled: !gateway.enabled }
          : gateway
      )
    );
  };

  const toggleShipping = (id: string) => {
    setShippingOptions(prev => 
      prev.map(option => 
        option.id === id 
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
  };

  const toggleTax = (id: string) => {
    setTaxRates(prev => 
      prev.map(rate => 
        rate.id === id 
          ? { ...rate, enabled: !rate.enabled }
          : rate
      )
    );
  };

  const toggleCurrency = (code: string) => {
    setCurrencies(prev => 
      prev.map(currency => 
        currency.code === code 
          ? { ...currency, enabled: !currency.enabled }
          : currency
      )
    );
  };

  const getGatewayIcon = (type: PaymentGateway['type']) => {
    switch (type) {
      case 'mpesa':
        return <CreditCardIcon className="h-5 w-5 text-green-600" />;
      case 'stripe':
        return <CreditCardIcon className="h-5 w-5 text-blue-600" />;
      case 'paypal':
        return <CreditCardIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <CreditCardIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (enabled: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        enabled 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="font-serif text-xl sm:text-2xl">E-commerce Settings</h2>
        <button className="btn btn-primary flex items-center justify-center gap-2 text-sm px-3 py-2">
          <SaveIcon className="h-4 w-4" />
          Save Settings
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'payment', label: 'Payment Gateways', shortLabel: 'Payment', icon: CreditCardIcon },
            { id: 'shipping', label: 'Shipping Options', shortLabel: 'Shipping', icon: TruckIcon },
            { id: 'tax', label: 'Tax Settings', shortLabel: 'Tax', icon: ReceiptIcon },
            { id: 'currency', label: 'Currencies', shortLabel: 'Currency', icon: SettingsIcon }
          ].map(({ id, label, shortLabel, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === id
                  ? 'border-gold text-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} />
                <span className="hidden xs:inline">{label}</span>
                <span className="xs:hidden">{shortLabel}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Payment Gateways Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="font-medium text-gray-900">Payment Gateways</h3>
            <button 
              onClick={() => setShowGatewayModal(true)}
              className="btn btn-primary flex items-center justify-center gap-2 text-sm px-3 py-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Gateway
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {paymentGateways.map((gateway) => (
              <div key={gateway.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getGatewayIcon(gateway.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{gateway.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{gateway.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleGateway(gateway.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      gateway.enabled ? 'bg-gold' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        gateway.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(gateway.enabled)}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">{gateway.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fees:</span>
                    <span className="font-medium">
                      {gateway.fees.percentage}% + {gateway.fees.fixed} {gateway.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mode:</span>
                    <span className={`font-medium ${
                      gateway.testMode ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {gateway.testMode ? 'Test' : 'Live'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="text-blue-600 hover:text-blue-900">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Options Tab */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="font-medium text-gray-900">Shipping Options</h3>
            <button 
              onClick={() => setShowShippingModal(true)}
              className="btn btn-primary flex items-center justify-center gap-2 text-sm px-3 py-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-4">
            {shippingOptions.map((option) => (
              <div key={option.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleShipping(option.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      option.enabled ? 'bg-gold' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        option.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <div className="font-medium">KES {option.cost}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Free over:</span>
                    <div className="font-medium">
                      {option.freeThreshold ? `KES ${option.freeThreshold}` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Delivery:</span>
                    <div className="font-medium">{option.estimatedDays} days</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Zones:</span>
                    <div className="font-medium">{option.zones.length} zones</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="text-blue-600 hover:text-blue-900">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tax Settings Tab */}
      {activeTab === 'tax' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="font-medium text-gray-900">Tax Rates</h3>
            <button className="btn btn-primary flex items-center justify-center gap-2 text-sm px-3 py-2">
              <PlusIcon className="h-4 w-4" />
              Add Tax Rate
            </button>
          </div>

          <div className="space-y-4">
            {taxRates.map((rate) => (
              <div key={rate.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ReceiptIcon className="h-5 w-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{rate.name}</h4>
                      <p className="text-sm text-gray-500">
                        {rate.rate}% {rate.type === 'percentage' ? 'percentage' : 'fixed amount'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTax(rate.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rate.enabled ? 'bg-gold' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rate.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rate:</span>
                    <div className="font-medium">{rate.rate}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium capitalize">{rate.type}</div>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <span className="text-gray-600">Applies to:</span>
                    <div className="font-medium">{rate.appliesTo.join(', ')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="text-blue-600 hover:text-blue-900">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Currencies Tab */}
      {activeTab === 'currency' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h3 className="font-medium text-gray-900">Supported Currencies</h3>
            <button className="btn btn-primary flex items-center justify-center gap-2 text-sm px-3 py-2">
              <PlusIcon className="h-4 w-4" />
              Add Currency
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exchange Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currencies.map((currency) => (
                  <tr key={currency.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{currency.code}</div>
                        <div className="text-sm text-gray-500">{currency.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currency.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currency.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCurrency(currency.code)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          currency.enabled ? 'bg-gold' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currency.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {currencies.map((currency) => (
              <div key={currency.code} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
                  </div>
                  <button
                    onClick={() => toggleCurrency(currency.code)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      currency.enabled ? 'bg-gold' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        currency.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Symbol:</span>
                    <div className="font-medium">{currency.symbol}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Rate:</span>
                    <div className="font-medium">{currency.rate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="text-blue-600 hover:text-blue-900">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceSettings;
