# WangarèLuxe - Luxury E-commerce Website

A modern, responsive e-commerce website built with React, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **E-commerce Functionality**: Product catalog, shopping cart, checkout
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🎨 **Modern UI**: Beautiful design with Tailwind CSS
- 📧 **Email Integration**: Contact forms and newsletter subscription
- 🔐 **Admin Panel**: Complete admin dashboard for managing products and orders
- 📊 **Analytics**: Built-in analytics and reporting
- 🚀 **Fast Performance**: Optimized with Vite and modern React patterns

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Vercel Serverless Functions, Node.js
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer with SMTP
- **Deployment**: Vercel
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account

### Installation

1. Clone the repository
```bash
git clone https://github.com/jnkcode888/wangare.git
cd wangare
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env-example.txt .env
```

4. Configure your environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_email_password
```

5. Start development server
```bash
npm run dev
```

## Deployment

This project is configured for automatic deployment on Vercel:

1. Push to main branch
2. Vercel automatically builds and deploys
3. Environment variables are configured in Vercel dashboard

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── services/           # API services
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── templates/          # Email templates
└── utils/              # Helper functions

api/                    # Vercel serverless functions
public/                 # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.

## Support

For support, email info@wangareluxe.com