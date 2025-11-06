# AlaaExplorion

AlaaExplorion is a modern, full-stack web application for exploring and discovering cars. Built with Next.js and TypeScript, it offers a seamless experience for browsing, searching, and managing favorite vehicles, along with features like test drive scheduling and an integrated chatbot.

## Features

- **Car Browsing**: Explore a diverse collection of cars with detailed information, images, and specifications.
- **Advanced Search & Filtering**: Search by name, brand, type, year, and price range with real-time filtering.
- **Favorites Management**: Save and manage your favorite cars for easy access.
- **Test Drive Scheduling**: Book test drives for selected vehicles.
- **Reviews System**: Read and submit reviews for cars.
- **Interactive Chatbot**: Get assistance through an integrated chat feature.
- **Responsive Design**: Optimized for desktop and mobile devices with a modern UI.
- **Real-time Updates**: Powered by SWR for efficient data fetching and caching.

## Tech Stack

- **Frontend**: Next.js 15.5.6, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Real-time Chat**: Ably Chat
- **Data Fetching**: SWR
- **Icons**: Lucide React
- **Development Tools**: TSX, TypeScript

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AlaaEid-1/carproject-alaaeid.git
   cd car-project-alaaeid
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your configuration (e.g., MongoDB URI, Ably keys). Note: Do not commit sensitive information.

4. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

The application provides RESTful API endpoints for managing cars, favorites, reviews, test drives, and chatbot interactions. All endpoints are accessible at `http://localhost:3000/api/` when running locally.

### Cars API

#### GET /api/cars
Retrieve all cars with optional filtering (type, year, price range, search query).
- **Method**: GET
- **Parameters**:
  - `type` (optional): Filter by car type (e.g., sedan, suv, sports)
  - `year` (optional): Filter by year
  - `priceMin` (optional): Minimum price filter
  - `priceMax` (optional): Maximum price filter
  - `search` (optional): Search by car name or brand
  - `sortBy` (optional): Sort field (name, price, year)
  - `sortOrder` (optional): Sort order (asc, desc)
- **Test Links**: Use localhost:3000/api/cars with appropriate parameters
- **Response**: JSON array of car objects
- **Status Codes**: 200 (success), 500 (server error)

#### POST /api/cars
Create a new car (admin functionality).
- **Method**: POST
- **Body**: JSON object with car data (name, brand, type, year, price, images, etc.)
- **Test**: Use tools like Postman or curl:
  ```bash
  curl -X POST http://localhost:3000/api/cars \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Car","brand":"Test Brand","type":"sedan","year":2023,"price":30000}'
  ```
- **Response**: Created car object
- **Status Codes**: 201 (created), 500 (server error)

### Favorites API

#### GET /api/favorites
Get user's favorite cars.
- **Method**: GET
- **Parameters**:
  - `userId` (optional): Filter by user ID
- **Test Links**: Use localhost:3000/api/favorites with appropriate parameters
- **Response**: JSON array of favorite car objects
- **Status Codes**: 200 (success), 500 (server error)

#### POST /api/favorites
Add a car to favorites.
- **Method**: POST
- **Body**: JSON object with carId
- **Test**: Use curl:
  ```bash
  curl -X POST http://localhost:3000/api/favorites \
    -H "Content-Type: application/json" \
    -d '{"carId":"507f1f77bcf86cd799439011"}'
  ```
- **Response**: Created favorite object
- **Status Codes**: 201 (created), 500 (server error)

#### DELETE /api/favorites/[id]
Remove a car from favorites.
- **Method**: DELETE
- **Test Link**: Use http://localhost:3000/api/favorites/[id] (replace with actual ID)
- **Response**: Success message
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

### Reviews API

#### GET /api/reviews
Get all reviews.
- **Method**: GET
- **Test Link**: Use http://localhost:3000/api/reviews
- **Response**: JSON array of review objects
- **Status Codes**: 200 (success), 500 (server error)

#### GET /api/reviews/[carId]
Get reviews for a specific car.
- **Method**: GET
<<<<<<< HEAD
- **Test Links**:
  - [Get reviews for car ID 68ff07e1c8a56b92d86420a5](https://carproject-alaaeid.vercel.app/api/reviews/68ff07e1c8a56b92d86420a5)
  - [Get reviews for car ID 68ff07e1c8a56b92d8642061](https://carproject-alaaeid.vercel.app/api/reviews/68ff07e1c8a56b92d8642061)
=======
- **Test Links**: Use http://localhost:3000/api/reviews/[carId] (replace with actual car ID)
>>>>>>> 94ec56c (add admin dashboard)
- **Response**: JSON array of reviews for the car
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

#### POST /api/reviews
Submit a new review.
- **Method**: POST
- **Body**: JSON object with review data (carId, user, rating, comment, etc.)
- **Test**: Use curl:
  ```bash
  curl -X POST http://localhost:3000/api/reviews \
    -H "Content-Type: application/json" \
    -d '{"carId":"507f1f77bcf86cd799439011","user":"Test User","rating":5,"comment":"Great car!"}'
  ```
- **Response**: Created review object
- **Status Codes**: 201 (created), 500 (server error)

### Test Drives API

#### GET /api/test-drives
Get user's test drive bookings.
- **Method**: GET
- **Parameters**:
  - `userId` (optional): Filter by user ID
- **Test Links**: Use http://localhost:3000/api/test-drives with appropriate parameters
- **Response**: JSON array of test drive objects
- **Status Codes**: 200 (success), 500 (server error)

#### POST /api/test-drives
Schedule a new test drive.
- **Method**: POST
- **Body**: JSON object with booking data (carId, user, date, time, etc.)
- **Test**: Use curl:
  ```bash
  curl -X POST http://localhost:3000/api/test-drives \
    -H "Content-Type: application/json" \
    -d '{"carId":"507f1f77bcf86cd799439011","user":"Test User","date":"2024-01-15","time":"10:00"}'
  ```
- **Response**: Created test drive object
- **Status Codes**: 201 (created), 500 (server error)

### Chatbot API

#### POST /api/chatbot
Send a message to the chatbot.
- **Method**: POST
- **Body**: JSON object with message and user
- **Test**: Use curl:
  ```bash
  curl -X POST http://localhost:3000/api/chatbot \
    -H "Content-Type: application/json" \
    -d '{"message":"Hello, can you help me?","user":"TestUser"}'
  ```
- **Response**: JSON object with bot response
- **Example Response**:
  ```json
  {
    "response": "Thank you for your message. Our team will get back to you soon."
  }
  ```
- **Status Codes**: 200 (success), 400 (bad request), 500 (server error)

## Testing

### How to Test the APIs

1. **Using Browser**: Click on the test links above to view JSON responses directly in your browser.

2. **Using curl**: Use the provided curl commands to test POST endpoints.

3. **Using Postman/Insomnia**: Import the endpoints and test with different parameters.

4. **Using JavaScript/fetch**: Example for testing GET request:
   ```javascript
   fetch('http://localhost:3000/api/cars')
     .then(response => response.json())
     .then(data => console.log(data));
   ```

### Test Scenarios

- **Happy Path**: Test with valid data and parameters
- **Edge Cases**: Test with invalid IDs, empty data, large datasets
- **Error Handling**: Test with malformed requests, missing parameters
- **Performance**: Test with multiple concurrent requests

### Local Testing

All test links use the local development server at `http://localhost:3000` when running the development server.

## Usage

1. **Browse Cars**: Visit the homepage to view featured cars and use filters to narrow down options.
2. **Search**: Use the search bar in the header to find specific cars by name or brand.
3. **View Details**: Click on any car card to see detailed information.
4. **Manage Favorites**: Add/remove cars from favorites via the Favorites page.
5. **Schedule Test Drives**: Book test drives from the Test Drives page.
6. **Chat Support**: Use the chat feature for assistance.

## Project Structure

```
car-project-alaaeid/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── cars/                 # Cars API
│   │   ├── chatbot/              # Chatbot API
│   │   ├── favorites/            # Favorites API
│   │   ├── reviews/              # Reviews API
│   │   └── test-drives/          # Test Drives API
│   ├── cars/                     # Car detail pages
│   ├── chat/                     # Chat page
│   ├── favorites/                # Favorites page
│   ├── test-drives/              # Test Drives page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable React components
│   ├── CarCard.tsx               # Car display card
│   ├── Chat.tsx                  # Chat component
│   ├── Header.tsx                # Site header
│   ├── SearchFilter.tsx          # Search and filter component
│   └── ...
├── lib/                          # Utility libraries
│   └── mongodb.ts                # MongoDB connection
├── models/                       # Mongoose models
│   ├── Car.ts                    # Car model
│   ├── Favorite.ts               # Favorite model
│   └── ...
├── public/                       # Static assets
│   └── images/                   # Car images
├── scripts/                      # Utility scripts
│   └── seed.ts                   # Database seeding script
├── types/                        # TypeScript type definitions
└── ...
```



