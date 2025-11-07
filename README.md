# 🚗 AlaaExplorion - Premium Car Discovery Platform

<div align="center">

![AlaaExplorion Logo](https://img.shields.io/badge/AlaaExplorion-FF6B35?style=for-the-badge&logo=car&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

**Discover. Explore. Drive.** Your ultimate destination for premium car experiences.

[🌐 Live Demo](https://carproject-alaaeid.vercel.app) • [📖 Documentation](#documentation) • [🚀 Quick Start](#installation)

</div>

---

## ✨ Overview

AlaaExplorion is a cutting-edge, full-stack web application that revolutionizes the way users discover, explore, and interact with premium automobiles. Built with modern web technologies, it offers an immersive experience combining advanced search capabilities, personalized recommendations, and seamless booking features.

### 🎯 Key Highlights

- **🚀 Modern Tech Stack**: Next.js 15, React 19, TypeScript, and MongoDB
- **🎨 Beautiful UI**: Responsive design with Tailwind CSS and custom animations
- **⚡ Real-time Features**: Live chat, instant search, and dynamic filtering
- **🔐 Secure Authentication**: NextAuth.js integration with role-based access
- **📱 Mobile-First**: Optimized for all devices and screen sizes
- **🔍 Advanced Search**: Multi-criteria filtering with instant results
- **💬 AI-Powered Chat**: Intelligent chatbot for personalized assistance
- **📊 Admin Dashboard**: Comprehensive management system for administrators

---

## 🌟 Features

### 🚗 Car Discovery & Exploration
- **Extensive Catalog**: Browse through a diverse collection of premium vehicles
- **Detailed Specifications**: Comprehensive car information, images, and features
- **Advanced Filtering**: Filter by brand, type, year, price range, and more
- **Smart Search**: Intelligent search with autocomplete suggestions
- **Image Galleries**: High-quality car images with zoom functionality

### 👤 User Experience
- **Personalized Favorites**: Save and manage favorite vehicles
- **Test Drive Booking**: Schedule test drives with preferred dates and times
- **Review System**: Read and write detailed car reviews
- **User Profiles**: Manage personal information and booking history
- **Responsive Design**: Seamless experience across all devices

### 🤖 AI & Automation
- **Intelligent Chatbot**: Get instant help and recommendations
- **Smart Recommendations**: AI-powered car suggestions based on preferences
- **Automated Notifications**: Email confirmations and reminders

### 👨‍💼 Admin Features
- **Dashboard Analytics**: Comprehensive statistics and insights
- **Car Management**: Add, edit, and manage vehicle inventory
- **User Management**: Monitor and manage user accounts
- **Booking Oversight**: Track and manage all bookings and test drives
- **Content Moderation**: Review and moderate user-generated content

---

## 🛠️ Tech Stack

### Frontend
```typescript
- Next.js 15.5.6          // React Framework
- React 19.1.0           // UI Library
- TypeScript             // Type Safety
- Tailwind CSS 3.4.4     // Styling
- Lucide React          // Icons
```

### Backend & Database
```typescript
- Next.js API Routes    // Backend API
- MongoDB + Mongoose   // Database
- NextAuth.js          // Authentication
- Ably Chat            // Real-time Chat
```

### Development & Deployment
```typescript
- TSX                   // Development Runner
- PostCSS + Autoprefixer // CSS Processing
- Vercel               // Deployment Platform
- ESLint + TypeScript  // Code Quality
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Git

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AlaaEid-1/carproject-alaaeid.git
   cd car-project-alaaeid
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env.local file
   cp .env.example .env.local

   # Add your configuration (database URI, API keys, etc.)
   ```

4. **Database Setup**
   ```bash
   # Seed the database with sample data
   npm run seed
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

6. **Production Build**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Documentation

### Core Endpoints

#### 🚗 Cars API
```typescript
GET    /api/cars           // Get all cars with filtering
POST   /api/cars           // Create new car (admin)
GET    /api/cars/[id]      // Get specific car
PUT    /api/cars/[id]      // Update car (admin)
DELETE /api/cars/[id]      // Delete car (admin)
GET    /api/cars/stats     // Get car statistics
```

#### 👤 User Management
```typescript
GET    /api/users          // Get all users (admin)
GET    /api/users/stats    // Get user statistics
POST   /api/auth/register  // User registration
POST   /api/auth/[...nextauth] // Authentication
```

#### ❤️ Favorites
```typescript
GET    /api/favorites      // Get user favorites
POST   /api/favorites      // Add to favorites
DELETE /api/favorites/[id] // Remove from favorites
```

#### 📝 Reviews
```typescript
GET    /api/reviews        // Get all reviews
GET    /api/reviews/[carId] // Get reviews for specific car
POST   /api/reviews        // Submit new review
```

#### 🗓️ Bookings & Test Drives
```typescript
GET    /api/bookings       // Get user bookings
POST   /api/bookings       // Create booking
GET    /api/test-drives    // Get test drive bookings
POST   /api/test-drives    // Schedule test drive
GET    /api/test-drives/stats // Get test drive statistics
```

#### 💬 Chat & Support
```typescript
POST   /api/chatbot        // Send message to chatbot
```

### Testing Examples

#### Get Cars with Filtering
```bash
curl "http://localhost:3000/api/cars?type=sedan&priceMin=20000&priceMax=50000"
```

#### Create a Test Drive Booking
```bash
curl -X POST http://localhost:3000/api/test-drives \
  -H "Content-Type: application/json" \
  -d '{
    "carId": "507f1f77bcf86cd799439011",
    "user": "John Doe",
    "date": "2024-02-15",
    "time": "14:00"
  }'
```

#### Chat with Bot
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What cars do you recommend for city driving?",
    "user": "John"
  }'
```

---

## 🏗️ Project Structure

```
car-project-alaaeid/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 cars/                 # Car management endpoints
│   │   ├── 📁 auth/                 # Authentication routes
│   │   ├── 📁 bookings/             # Booking system
│   │   ├── 📁 chatbot/              # AI chat functionality
│   │   └── 📁 ...
│   ├── 📁 admin/                    # Admin dashboard pages
│   ├── 📁 auth/                     # Authentication pages
│   ├── 📁 cars/                     # Car detail pages
│   ├── 📁 chat/                     # Chat interface
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout component
│   └── 📄 page.tsx                  # Homepage
├── 📁 components/                   # Reusable UI components
│   ├── 🧩 CarCard.tsx               # Car display component
│   ├── 💬 Chat.tsx                  # Chat interface
│   ├── 🎯 Header.tsx                # Navigation header
│   ├── 🔍 SearchFilter.tsx          # Search and filter UI
│   └── 🎨 ...
├── 📁 lib/                          # Utility libraries
│   ├── 🔗 mongodb.ts                # Database connection
│   ├── 🔐 auth.ts                   # Authentication helpers
│   └── 📅 dateUtils.ts              # Date utilities
├── 📁 models/                       # Database models
│   ├── 🚗 Car.ts                    # Car schema
│   ├── 👤 User.ts                   # User schema
│   ├── ❤️ Favorite.ts               # Favorites schema
│   └── 📝 ...
├── 📁 public/                       # Static assets
│   └── 📸 images/cars/              # Car images
├── 📁 scripts/                      # Utility scripts
│   └── 🌱 seed.ts                   # Database seeding
├── 📁 types/                        # TypeScript definitions
└── ⚙️ Configuration files
```

---

## 🎨 UI/UX Design

### Design Philosophy
- **Minimalist Aesthetics**: Clean, modern interface with focus on content
- **Intuitive Navigation**: User-friendly design with clear visual hierarchy
- **Performance Optimized**: Fast loading with optimized images and lazy loading
- **Accessibility First**: WCAG compliant with keyboard navigation support

### Key Components
- **Hero Section**: Engaging homepage with featured cars
- **Car Grid**: Responsive grid layout with hover effects
- **Search Interface**: Advanced filtering with real-time results
- **Admin Dashboard**: Comprehensive management interface
- **Chat Widget**: Floating chat button with smooth animations

---

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User flow testing with Playwright
- **Performance Tests**: Lighthouse and Web Vitals monitoring

---

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch
4. Custom domain configuration available

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **MongoDB** for the robust database solution
- **Tailwind CSS** for the utility-first CSS framework
- **All Contributors** who helped make this project possible

---

<div align="center">

**Made with ❤️ by Alaa Eid**

[⭐ Star this repo](https://github.com/AlaaEid-1/carproject-alaaeid) • [🐛 Report Issues](https://github.com/AlaaEid-1/carproject-alaaeid/issues) • [💬 Discussions](https://github.com/AlaaEid-1/carproject-alaaeid/discussions)

</div>
