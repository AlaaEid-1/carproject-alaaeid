# 🚗 Alaa Eid Car Project - Professional Car Discovery Platform


[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Ably](https://img.shields.io/badge/Ably-Real--time-red)](https://ably.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)

A modern, full-stack car exploration platform built with cutting-edge technologies. Discover, compare, and connect with fellow car enthusiasts through an intuitive interface featuring real-time chat, advanced search, and comprehensive car information.

**Repository**: []()

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📡 API Reference](#-api-reference)
- [🧪 Testing the APIs](#-testing-the-apis)
- [🏗️ Project Architecture](#️-project-architecture)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Key Features

### 🚙 Car Discovery & Management
- **Comprehensive Database**: Extensive collection of cars with high-resolution images
- **Advanced Search & Filtering**: Multi-criteria search by brand, model, year, price range, and specifications
- **Detailed Car Profiles**: In-depth information including specifications, features, and performance metrics
- **Favorites System**: Save and manage favorite cars for easy access

### 💬 Real-Time Communication
- **Live Group Chat**: Instant messaging with all users using Ably real-time messaging
- **WhatsApp-Style Interface**: Modern chat UI with message bubbles, typing indicators, and user avatars
- **Persistent Messages**: Chat history maintained across sessions
- **Floating Chat Button**: Easy access to chat from any page

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Smooth Animations**: Polished transitions and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### 🔧 Technical Features
- **AI-Powered Chatbot**: Intelligent responses using OpenAI integration
- **Review System**: User-generated reviews and ratings for cars
- **Test Drive Booking**: Schedule test drives with preferred cars
- **Performance Optimized**: Fast loading with Next.js App Router and optimized images

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks and context
- **Icons**: Lucide React for consistent iconography

### Backend & Database
- **API Routes**: Next.js API routes for serverless functions
- **Database**: MongoDB Atlas with Mongoose ODM
- **Real-time**: Ably for instant messaging and live updates
- **Authentication**: NextAuth.js (planned for future release)

### DevOps & Deployment
- **Deployment**: Vercel for global CDN and edge functions
- **Version Control**: Git with conventional commits
- **Package Manager**: npm with package-lock.json
- **Environment**: Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **MongoDB Atlas**: Cloud database account
- **Ably Account**: Real-time messaging service
- **Git**: Version control system

### Installation & Setup

1. **Clone the Repository**
   ```bash

   cd alaa_eid_car_project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```

   Configure your `.env.local` file:
   ```env
   # Database

   # Real-time Chat
   ABLY_API_KEY=your-ably-api-key-here
   NEXT_PUBLIC_ABLY_API_KEY=your-ably-api-key-here

   ```

4. **Database Seeding**
   ```bash
   npx tsx scripts/seed.ts
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser
   - Start exploring cars and testing features!

## 📡 API Reference

### Cars API
```http
GET    /api/cars              # Get all cars with filtering
POST   /api/cars              # Create new car
GET    /api/cars/[id]         # Get specific car details
PUT    /api/cars/[id]         # Update car information
DELETE /api/cars/[id]         # Remove car
```

### User Features
```http
GET    /api/favorites?userId={userId}    # Get user's favorite cars
POST   /api/favorites         # Add car to favorites
DELETE /api/favorites?userId={userId}&carId={carId}    # Remove from favorites

POST   /api/test-drives        # Schedule test drive
GET    /api/test-drives        # Get test drive bookings
```

### Communication
```http
POST   /api/chatbot           # AI-powered chat responses
GET    /api/reviews/[carId]   # Get car reviews for specific car
POST   /api/reviews           # Submit car review
GET    /api/reviews           # Get all reviews from all cars
```

## 🧪 Testing the APIs

### Testing with Postman or cURL

1. **Get All Cars**
   ```bash
   curl http://localhost:3000/api/cars
   ```

2. **Get Cars with Filtering**
   ```bash
   curl "http://localhost:3000/api/cars?type=SUV&priceMin=20000&priceMax=50000"
   ```

3. **Get Specific Car**
   ```bash
   curl http://localhost:3000/api/cars/68fb27e1e3dd58d2f0da440d
   ```

4. **Create New Car**
   ```bash
   curl -X POST http://localhost:3000/api/cars \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Car",
       "brand": "Test Brand",
       "model": "Test Model",
       "year": 2024,
       "price": 30000,
       "type": "Sedan",
       "description": "A test car",
       "images": ["/images/cars/test.jpg"],
       "specifications": {
         "engine": "2.0L",
         "horsepower": 200,
         "transmission": "Automatic"
       }
     }'
   ```

5. **Get User Favorites**
   ```bash
   curl "http://localhost:3000/api/favorites?userId=guest"
   ```

6. **Add to Favorites**
   ```bash
   curl -X POST http://localhost:3000/api/favorites \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "guest",
       "carId": "68fb27e1e3dd58d2f0da440d"
     }'
   ```

7. **Get All Reviews**
   ```bash
   curl http://localhost:3000/api/reviews
   ```

8. **Get Reviews for Specific Car**
   ```bash
   curl http://localhost:3000/api/reviews/68fb27e1e3dd58d2f0da440d
   ```

9. **Submit Review**
   ```bash
   curl -X POST http://localhost:3000/api/reviews \
     -H "Content-Type: application/json" \
     -d '{
       "carId": "68fb27e1e3dd58d2f0da440d",
       "user": "Test User",
       "rating": 5,
       "comment": "Great car!"
     }'
   ```

## 🏗️ Project Architecture

```
alaa_eid_car_project/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 cars/                 # Car management endpoints
│   │   ├── 📁 chatbot/              # AI chat integration
│   │   ├── 📁 favorites/            # User favorites
│   │   ├── 📁 reviews/              # Review system
│   │   └── 📁 test-drives/          # Test drive bookings
│   ├── 📁 cars/[id]/                # Dynamic car pages
│   ├── 📁 chat/                     # Live chat interface
│   ├── 📁 favorites/                # User favorites page
│   ├── 📁 test-drives/              # Test drive management
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Homepage
├── 📁 components/                   # Reusable UI components
│   ├── CarCard.tsx                  # Car display card
│   ├── Chat.tsx                     # Chat interface
│   ├── FloatingChatButton.tsx       # Chat access button
│   ├── Header.tsx                   # Navigation header
│   ├── SearchFilter.tsx             # Search and filter UI
│   └── Footer.tsx                   # Site footer
├── 📁 lib/                          # Utility libraries
│   └── mongodb.ts                   # Database connection
├── 📁 models/                       # Data models
│   ├── Car.ts                       # Car schema
│   ├── Favorite.ts                  # Favorites schema
│   └── TestDrive.ts                 # Test drive schema
├── 📁 public/                       # Static assets
│   └── 📁 images/cars/              # Car images
├── 📁 scripts/                      # Utility scripts
│   └── seed.ts                      # Database seeding
├── 📁 types/                        # TypeScript definitions
│   └── index.ts                     # Global types
├── 📄 .env.local                    # Environment variables
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tailwind.config.ts            # Tailwind configuration
└── 📄 vercel.json                   # Vercel deployment config
```

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Configure environment variables in Vercel dashboard
3. **Automatic Deployment**: Push changes to trigger automatic deployment
4. **Custom Domain**: Configure custom domain (optional)

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test thoroughly before submitting PR
- Update documentation for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **MongoDB** for reliable database solutions
- **Ably** for real-time messaging capabilities
- **Tailwind CSS** for utility-first styling
- **Vercel** for seamless deployment
