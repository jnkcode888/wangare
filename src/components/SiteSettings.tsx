import React, { useState, useEffect } from 'react';
import { 
  SettingsIcon, 
  SaveIcon, 
  UploadIcon, 
  GlobeIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon,
  FacebookIcon
} from 'lucide-react';

interface BusinessInfo {
  businessName: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  website: string;
  foundedYear: number;
  businessType: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  pinterest: string;
}

const SiteSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'business' | 'social'>('business');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: 'WangarèLuxe',
    tagline: 'Luxury Redefined',
    description: 'Premium luxury accessories and lifestyle products',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    email: 'info@wangareluxe.com',
    phone: '+254 XXX XXX XXX',
    address: '123 Luxury Lane',
    city: 'Nairobi',
    country: 'Kenya',
    postalCode: '00100',
    website: 'https://wangareluxe.com',
    foundedYear: 2025,
    businessType: 'E-commerce'
  });

  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: 'https://facebook.com/wangareluxe',
    instagram: 'https://instagram.com/wangareluxe',
    twitter: 'https://twitter.com/wangareluxe',
    linkedin: 'https://linkedin.com/company/wangareluxe',
    youtube: 'https://youtube.com/wangareluxe',
    tiktok: 'https://tiktok.com/@wangareluxe',
    pinterest: 'https://pinterest.com/wangareluxe'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // In production, this would save to your backend
    console.log('Saving settings:', { businessInfo, socialMedia });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const handleImageUpload = (type: 'logo' | 'favicon') => {
    // In production, this would handle actual file upload
    console.log(`Uploading ${type} image`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="font-serif text-xl sm:text-2xl">Site Settings</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center justify-center gap-2 text-sm px-3 py-2"
        >
          <SaveIcon className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 overflow-x-auto">
           {[
             { id: 'business', label: 'Business Info', shortLabel: 'Business', icon: SettingsIcon },
             { id: 'social', label: 'Social Media', shortLabel: 'Social', icon: FacebookIcon }
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

      {/* Business Info Tab */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={businessInfo.tagline}
                  onChange={(e) => setBusinessInfo({...businessInfo, tagline: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <input
                  type="number"
                  value={businessInfo.foundedYear}
                  onChange={(e) => setBusinessInfo({...businessInfo, foundedYear: Number(e.target.value)})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  value={businessInfo.businessType}
                  onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                >
                  <option value="E-commerce">E-commerce</option>
                  <option value="Retail">Retail</option>
                  <option value="Service">Service</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Brand Assets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img src={businessInfo.logo} alt="Logo" className="w-16 h-16 object-contain" />
                  </div>
                  <button
                    onClick={() => handleImageUpload('logo')}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <UploadIcon className="h-4 w-4" />
                    Upload Logo
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img src={businessInfo.favicon} alt="Favicon" className="w-12 h-12 object-contain" />
                  </div>
                  <button
                    onClick={() => handleImageUpload('favicon')}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <UploadIcon className="h-4 w-4" />
                    Upload Favicon
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MailIcon className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PhoneIcon className="inline w-4 h-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="inline w-4 h-4 mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={businessInfo.city}
                  onChange={(e) => setBusinessInfo({...businessInfo, city: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={businessInfo.country}
                  onChange={(e) => setBusinessInfo({...businessInfo, country: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={businessInfo.postalCode}
                  onChange={(e) => setBusinessInfo({...businessInfo, postalCode: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GlobeIcon className="inline w-4 h-4 mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={businessInfo.website}
                  onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Object.entries(socialMedia).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {platform === 'youtube' ? 'YouTube' : platform}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setSocialMedia({...socialMedia, [platform]: e.target.value})}
                    placeholder={`https://${platform}.com/your-username`}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-gold"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SiteSettings;
