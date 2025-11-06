import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import dbConnect from '../lib/mongodb';
import Car from '../models/Car';

const mockCars = [
  {
    "id": 1,
    "brand": "Tesla",
    "name": "Model S Plaid",
    "type": "sedan",
    "year": 2023,
    "price": 89990,
    "pricePerDay": 150,
    "engine": "Tri-Motor Electric",
    "fuel": "Electric",
    "colors": ["Black", "Red", "Blue"],
    "rating": 4.9,
    "description": "The 2023 Tesla Model S Plaid delivers unmatched electric performance with instant torque, luxurious comfort, and cutting-edge tech features like Autopilot.",
     "images": [
      "/images/cars/TeslaModelSPlaid.jpg",
      "/images/cars/tesla2.jpg",
      "/images/cars/tesla3.jpg"
    ],
    "reviews": [
      {
        "user": "John Doe",
        "rating": 5,
        "comment": "Incredible performance and comfort.",
        "createdAt": "2024-03-01T10:00:00Z"
      },
      {
        "user": "Sarah Miller",
        "rating": 4.5,
        "comment": "Love the range and futuristic design.",
        "createdAt": "2024-03-02T11:00:00Z"
      },
      {
        "user": "Mike Johnson",
        "rating": 5,
        "comment": "Best electric car I've driven.",
        "createdAt": "2024-03-03T12:00:00Z"
      }
    ]
  },
  {
    "id": 2,
    "brand": "Toyota",
    "name": "Camry",
    "type": "sedan",
    "year": 2023,
    "price": 25000,
    "pricePerDay": 40,
    "engine": "2.5L 4-Cylinder",
    "fuel": "Gasoline",
    "colors": [ "Black", "White", "Blue"],
    "rating": 4.5,
    "description": "The Toyota Camry offers reliable performance, excellent fuel efficiency, and a comfortable interior perfect for daily commuting and long drives.",
     "images": [
      "/images/cars/toyota1.jpg",
      "/images/cars/toyota2.jpg",
      "/images/cars/toyota3.jpg"
    ],
    "reviews": [
      {
        "user": "Jane Smith",
        "rating": 4,
        "comment": "Very comfortable and reliable.",
        "createdAt": "2024-03-04T13:00:00Z"
      },
      {
        "user": "Tom Brown",
        "rating": 5,
        "comment": "Great car for the price!",
        "createdAt": "2024-03-05T14:00:00Z"
      },
      {
        "user": "Lisa Davis",
        "rating": 4.5,
        "comment": "Excellent fuel economy.",
        "createdAt": "2024-03-06T15:00:00Z"
      }
    ]
  },
  {
    "id": 3,
    "brand": "Honda",
    "name": "CR-V",
    "type": "suv",
    "year": 2023,
    "price": 28000,
    "pricePerDay": 45,
    "engine": "1.5L Turbo 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["Red","White", "Gray", "Blue"],
    "rating": 4.5,
    "description": "The Honda CR-V provides a versatile and spacious interior with top-notch safety features, making it ideal for families and outdoor adventures.",
     "images": [
      "/images/cars/honda1.jpg",
      "/images/cars/honda2.jpg",
      "/images/cars/honda3.jpg",
      "/images/cars/honda4.jpg"
    ],
    "reviews": [
      {
        "user": "Mike Johnson",
        "rating": 5,
        "comment": "Perfect family SUV!",
        "createdAt": "2024-03-07T16:00:00Z"
      },
      {
        "user": "Sarah Wilson",
        "rating": 4,
        "comment": "Great fuel economy and handling.",
        "createdAt": "2024-03-08T17:00:00Z"
      },
      {
        "user": "David Lee",
        "rating": 4.5,
        "comment": "Spacious and reliable.",
        "createdAt": "2024-03-09T18:00:00Z"
      }
    ]
  },
  {
    "id": 4,
    "brand": "Ford",
    "name": "Mustang",
    "type": "coupe",
    "year": 2023,
    "price": 35000,
    "pricePerDay": 55,
    "engine": "2.3L EcoBoost 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["Red", "Orange","Blue"],
    "rating": 4.5,
    "description": "The Ford Mustang is an iconic American muscle car known for its powerful performance, aggressive styling, and thrilling driving experience.",
    "images": [
      "/images/cars/ford1.jpg",
      "/images/cars/ford2.jpg",
      "/images/cars/ford3.jpg"
    ],
    "reviews": [
      {
        "user": "Tom Brown",
        "rating": 5,
        "comment": "Amazing performance and style!",
        "createdAt": "2024-03-10T19:00:00Z"
      },
      {
        "user": "Lisa Davis",
        "rating": 4,
        "comment": "Fun to drive, but gas mileage could be better.",
        "createdAt": "2024-03-11T20:00:00Z"
      },
      {
        "user": "Alex Chen",
        "rating": 4.5,
        "comment": "Iconic design.",
        "createdAt": "2024-03-12T21:00:00Z"
      }
    ]
  },
  {
    "id": 5,
    "brand": "BMW",
    "name": "X5",
    "type": "suv",
    "year": 2023,
    "price": 55000,
    "pricePerDay": 90,
    "engine": "3.0L Turbo I6",
    "fuel": "Gasoline",
    "colors": ["Black", "White","Green"],
    "rating": 4.5,
    "description": "The BMW X5 combines luxury, performance, and advanced technology in a spacious SUV, offering a smooth ride and premium interior.",
    "images": [
      "/images/cars/bmw1.jpg",
      "/images/cars/bmw2.jpg",
      "/images/cars/bmw3.jpg"
    ],
    "reviews": [
      {
        "user": "Alex Chen",
        "rating": 5,
        "comment": "Luxury at its finest!",
        "createdAt": "2024-03-13T22:00:00Z"
      },
      {
        "user": "Emma Taylor",
        "rating": 4,
        "comment": "Excellent driving dynamics.",
        "createdAt": "2024-03-14T23:00:00Z"
      },
      {
        "user": "Peter Anderson",
        "rating": 4.5,
        "comment": "Comfortable and powerful.",
        "createdAt": "2024-03-15T00:00:00Z"
      }
    ]
  },
  {
    "id": 6,
    "brand": "Chevrolet",
    "name": "Silverado",
    "type": "truck",
    "year": 2023,
    "price": 38000,
    "pricePerDay": 60,
    "engine": "5.3L V8",
    "fuel": "Gasoline",
    "colors": ["Red", "Black", "White", "Blue"],
    "rating": 4.0,
    "description": "The Chevrolet Silverado is a robust pickup truck designed for heavy-duty work, towing, and off-road adventures with a strong engine and durable build.",
     "images": [
      "/images/cars/Chevrolet1.jpg",
      "/images/cars/Chevrolet2.jpg",
      "/images/cars/Chevrolet3.jpg",
      "/images/cars/Chevrolet4.jpg"
    ],
    "reviews": [
      {
        "user": "David Wilson",
        "rating": 4,
        "comment": "Tough and reliable truck!",
        "createdAt": "2024-03-16T01:00:00Z"
      },
      {
        "user": "Maria Garcia",
        "rating": 4,
        "comment": "Great for hauling and towing.",
        "createdAt": "2024-03-17T02:00:00Z"
      },
      {
        "user": "Mark Davis",
        "rating": 3.5,
        "comment": "Solid performance.",
        "createdAt": "2024-03-18T03:00:00Z"
      }
    ]
  },
  {
    "id": 7,
    "brand": "Mazda",
    "name": "CX-5",
    "type": "suv",
    "year": 2023,
    "price": 27000,
    "pricePerDay": 45,
    "engine": "2.5L 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["Red", " Black", " White", "Red"],
    "rating": 4.5,
    "description": "The Mazda CX-5 features sporty handling, a premium interior, and advanced safety tech, making it a joy to drive in urban and highway settings.",
    "images": [
      "/images/cars/mazada1.jpg",
      "/images/cars/mazada2.jpg",
      "/images/cars/mazada3.jpg",
      "/images/cars/mazada4.jpg"

    ],
    "reviews": [
      {
        "user": "Robert Johnson",
        "rating": 4,
        "comment": "Beautiful design and fun to drive!",
        "createdAt": "2024-03-19T04:00:00Z"
      },
      {
        "user": "Linda Thompson",
        "rating": 5,
        "comment": "Excellent value for money.",
        "createdAt": "2024-03-20T05:00:00Z"
      },
      {
        "user": "Anna Garcia",
        "rating": 4.5,
        "comment": "Great handling.",
        "createdAt": "2024-03-21T06:00:00Z"
      }
    ]
  },
  {
    "id": 8,
    "brand": "Audi",
    "name": "A4",
    "type": "sedan",
    "year": 2023,
    "price": 42000,
    "pricePerDay": 70,
    "engine": "2.0L Turbo 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["White", "Black"," Red"],
    "rating": 4.5,
    "description": "The Audi A4 offers refined performance, advanced technology, and a luxurious interior, providing a quiet and comfortable ride with excellent handling.",
     "images": [
      "/images/cars/audi1.jpg",
      "/images/cars/audi2.jpg",
      "/images/cars/audi3.jpg"
    ],
    "reviews": [
      {
        "user": "Peter Anderson",
        "rating": 5,
        "comment": "Luxurious and technologically advanced!",
        "createdAt": "2024-03-22T07:00:00Z"
      },
      {
        "user": "Karen Miller",
        "rating": 4,
        "comment": "Comfortable and quiet ride.",
        "createdAt": "2024-03-23T08:00:00Z"
      },
      {
        "user": "James Wilson",
        "rating": 4.5,
        "comment": "Excellent performance.",
        "createdAt": "2024-03-24T09:00:00Z"
      }
    ]
  },
  {
    "id": 9,
    "brand": "Jeep",
    "name": "Wrangler",
    "type": "suv",
    "year": 2023,
    "price": 32000,
    "pricePerDay": 50,
    "engine": "3.6L V6",
    "fuel": "Gasoline",
    "colors": ["Briht White", "Black",  " Blue"],
    "rating": 4.5,
    "description": "The Jeep Wrangler is built for off-road adventures with its rugged design, removable top, and superior ground clearance, perfect for outdoor enthusiasts.",
     "images": [
      "/images/cars/jeep1.jpg",
      "/images/cars/jeep2.jpg",
      "/images/cars/jeep3.jpg"
    ],
    "reviews": [
      {
        "user": "Mark Davis",
        "rating": 5,
        "comment": "Unmatched off-road capability!",
        "createdAt": "2024-03-25T10:00:00Z"
      },
      {
        "user": "Susan Clark",
        "rating": 4,
        "comment": "Great for outdoor adventures.",
        "createdAt": "2024-03-26T11:00:00Z"
      },
      {
        "user": "Kevin Wilson",
        "rating": 4.5,
        "comment": "Tough and fun.",
        "createdAt": "2024-03-27T12:00:00Z"
      }
    ]
  },
  {
    "id": 10,
    "brand": "Mercedes-Benz",
    "name": "C-Class",
    "type": "sedan",
    "year": 2023,
    "price": 48000,
    "pricePerDay": 80,
    "engine": "2.0L Turbo 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["Black", "White", " Blue"],
    "rating": 4.5,
    "description": "The Mercedes-Benz C-Class delivers luxury and safety with its premium materials, advanced driver-assist features, and smooth, powerful engine.",
    "images": [
      "/images/cars/merced1.jpg",
      "/images/cars/merced2.jpg",
      "/images/cars/merced3.jpg"
    ],
    "reviews": [
      {
        "user": "James Wilson",
        "rating": 5,
        "comment": "Ultimate luxury experience!",
        "createdAt": "2024-03-28T13:00:00Z"
      },
      {
        "user": "Patricia Moore",
        "rating": 4,
        "comment": "Exceptional comfort and technology.",
        "createdAt": "2024-03-29T14:00:00Z"
      },
      {
        "user": "Emily Davis",
        "rating": 4.5,
        "comment": "Smooth ride.",
        "createdAt": "2024-03-30T15:00:00Z"
      }
    ]
  },
  {
    "id": 11,
    "brand": "Nissan",
    "name": "Altima",
    "type": "sedan",
    "year": 2023,
    "price": 26000,
    "pricePerDay": 40,
    "engine": "2.5L 4-Cylinder",
    "fuel": "Gasoline",
    "colors": [" White", "black", " red"],
    "rating": 4.0,
    "description": "The Nissan Altima provides a comfortable and efficient ride with modern technology, ample space, and reliable performance for everyday driving.",
    "images": [
      "/images/cars/nessan1.jpg",
      "/images/cars/nessan2.jpg",
      "/images/cars/nessan3.jpg"
    ],
    "reviews": [
      {
        "user": "Emily Davis",
        "rating": 4,
        "comment": "Great value and comfortable!",
        "createdAt": "2024-03-31T16:00:00Z"
      },
      {
        "user": "Michael Brown",
        "rating": 4,
        "comment": "Reliable daily driver.",
        "createdAt": "2024-04-01T17:00:00Z"
      },
      {
        "user": "Sarah Johnson",
        "rating": 3.5,
        "comment": "Good performance.",
        "createdAt": "2024-04-02T18:00:00Z"
      }
    ]
  },
  {
    "id": 12,
    "brand": "Subaru",
    "name": "Outback",
    "type": "suv",
    "year": 2023,
    "price": 29000,
    "pricePerDay": 45,
    "engine": "2.5L Boxer 4-Cylinder",
    "fuel": "Gasoline",
    "colors": [ " Silver", "Crimson Red Pearl", "Red"],
    "rating": 4.5,
    "description": "The Subaru Outback combines wagon versatility with SUV capability, featuring all-wheel drive, high ground clearance, and a spacious, practical interior.",
     "images": [
      "/images/cars/subaro1.jpg",
      "/images/cars/subaro2.jpg",
      "/images/cars/subaro3.jpg"
    ],
    "reviews": [
      {
        "user": "Sarah Johnson",
        "rating": 5,
        "comment": "Perfect for outdoor adventures!",
        "createdAt": "2024-04-03T19:00:00Z"
      },
      {
        "user": "David Lee",
        "rating": 4,
        "comment": "Spacious and reliable.",
        "createdAt": "2024-04-04T20:00:00Z"
      },
      {
        "user": "Lisa Martinez",
        "rating": 4.5,
        "comment": "Great AWD.",
        "createdAt": "2024-04-05T21:00:00Z"
      }
    ]
  },
  {
    "id": 13,
    "brand": "Volkswagen",
    "name": "Golf",
    "type": "hatchback",
    "year": 2023,
    "price": 24000,
    "pricePerDay": 40,
    "engine": "1.4L Turbo 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["White"," Blue", " Red", "Black"],
    "rating": 4.5,
    "description": "The Volkswagen Golf is a fun-to-drive hatchback with agile handling, advanced safety features, and an efficient engine, ideal for city and highway use.",
    "images": [
      "/images/cars/volk1.jpg",
      "/images/cars/volk2.jpg",
      "/images/cars/volk3.jpg",  
      "/images/cars/volk4.jpg"

    ],
    "reviews": [
      {
        "user": "Anna Garcia",
        "rating": 4,
        "comment": "Fun to drive and practical!",
        "createdAt": "2024-04-06T22:00:00Z"
      },
      {
        "user": "Robert Taylor",
        "rating": 5,
        "comment": "Excellent handling.",
        "createdAt": "2024-04-07T23:00:00Z"
      },
      {
        "user": "Chris Lee",
        "rating": 4.5,
        "comment": "Reliable and efficient.",
        "createdAt": "2024-04-08T00:00:00Z"
      }
    ]
  },
  {
    "id": 14,
    "brand": "Hyundai",
    "name": "Tucson",
    "type": "suv",
    "year": 2023,
    "price": 27000,
    "pricePerDay": 45,
    "engine": "2.5L 4-Cylinder",
    "fuel": "Gasoline",
    "colors": [" Black", "White", " Red"],
    "rating": 4.5,
    "description": "The Hyundai Tucson offers modern design, advanced features, and a comfortable ride in a compact SUV package, with excellent value and warranty.",
     "images": [
      "/images/cars/hynda1.jpg",
      "/images/cars/hynda2.jpg",
      "/images/cars/hynda3.jpg"
    ],
    "reviews": [
      {
        "user": "Lisa Martinez",
        "rating": 4,
        "comment": "Great features for the price!",
        "createdAt": "2024-04-09T01:00:00Z"
      },
      {
        "user": "Kevin Wilson",
        "rating": 5,
        "comment": "Comfortable and stylish.",
        "createdAt": "2024-04-10T02:00:00Z"
      },
      {
        "user": "Maria Garcia",
        "rating": 4.5,
        "comment": "Excellent warranty.",
        "createdAt": "2024-04-11T03:00:00Z"
      }
    ]
  },
  {
    "id": 15,
    "brand": "Kia",
    "name": "Sportage",
    "type": "suv",
    "year": 2022,
    "price": 25000,
    "pricePerDay": 40,
    "engine": "2.4L 4-Cylinder",
    "fuel": "Gasoline",
    "colors": ["Black", " White","Green"],
    "rating": 4.0,
    "description": "The Kia Sportage provides a bold design, spacious cabin, and advanced safety tech, making it a reliable choice for families seeking affordability and features.",
     "images": [
      "/images/cars/kia1.jpg",
      "/images/cars/kia2.jpg",
      "/images/cars/kia3.jpg"
    ],
    "reviews": [
      {
        "user": "Tom Brown",
        "rating": 4,
        "comment": "Stylish and affordable!",
        "createdAt": "2024-04-12T04:00:00Z"
      },
      {
        "user": "Jane Smith",
        "rating": 4,
        "comment": "Good safety features.",
        "createdAt": "2024-04-13T05:00:00Z"
      },
      {
        "user": "Mike Johnson",
        "rating": 3.5,
        "comment": "Comfortable ride.",
        "createdAt": "2024-04-14T06:00:00Z"
      }
    ]
  },
  {
    "id": 16,
    "brand": "Lexus",
    "name": "RX",
    "type": "suv",
    "year": 2023,
    "price": 55000,
    "pricePerDay": 90,
    "engine": "3.5L V6 Hybrid",
    "fuel": "Hybrid",
    "colors": ["Selver", "Orange", "Green", "Blue"],
    "rating": 4.5,
    "description": "The Lexus RX blends luxury with efficiency in a hybrid SUV, offering a smooth ride, premium interior, and cutting-edge technology for discerning drivers.",
     "images": [
      "/images/cars/luxus1.jpg",
      "/images/cars/luxus2.jpg",
      "/images/cars/luxus3.jpg",
      "/images/cars/luxus4.jpg",

    ],
    "reviews": [
      {
        "user": "Alex Chen",
        "rating": 5,
        "comment": "Luxurious and efficient!",
        "createdAt": "2024-04-15T07:00:00Z"
      },
      {
        "user": "Emma Taylor",
        "rating": 4,
        "comment": "Smooth hybrid performance.",
        "createdAt": "2024-04-16T08:00:00Z"
      },
      {
        "user": "Peter Anderson",
        "rating": 4.5,
        "comment": "Premium feel.",
        "createdAt": "2024-04-17T09:00:00Z"
      }
    ]
  },
  {
    "id": 17,
    "brand": "Porsche",
    "name": "911",
    "type": "coupe",
    "year": 2023,
    "price": 120000,
    "pricePerDay": 200,
    "engine": "3.0L Turbo Flat-6",
    "fuel": "Gasoline",
    "colors": [ "Black", " White", "Blue", "green"],
    "rating": 4.8,
    "description": "The Porsche 911 is a legendary sports car with exhilarating performance, precise handling, and iconic design, delivering thrills on the track and road.",
     "images": [
      "/images/cars/porsche1.jpg",
      "/images/cars/porsche2.jpg",
      "/images/cars/porsche3.jpg",
      "/images/cars/porsche4.jpg",

    ],
    "reviews": [
      {
        "user": "Tom Brown",
        "rating": 5,
        "comment": "Exhilarating performance!",
        "createdAt": "2024-04-18T10:00:00Z"
      },
      {
        "user": "Lisa Davis",
        "rating": 5,
        "comment": "Iconic and fun.",
        "createdAt": "2024-04-19T11:00:00Z"
      },
      {
        "user": "Alex Chen",
        "rating": 4.5,
        "comment": "Precision handling.",
        "createdAt": "2024-04-20T12:00:00Z"
      }
    ]
  },
  {
    "id": 18,
    "brand": "Ferrari",
    "name": "488",
    "type": "coupe",
    "year": 2022,
    "price": 330000,
    "pricePerDay": 550,
    "engine": "3.9L Twin-Turbo V8",
    "fuel": "Gasoline",
    "colors": [" Red "],
    "rating": 4.9,
    "description": "The Ferrari 488 Spider offers supercar performance with a retractable hardtop, stunning design, and a roaring V8 engine for an unforgettable driving experience.",
     "images": [
      "/images/cars/ferrari1.jpg"
    ],
    "reviews": [
      {
        "user": "Mark Davis",
        "rating": 5,
        "comment": "Supercar thrill!",
        "createdAt": "2024-04-21T13:00:00Z"
      },
      {
        "user": "Susan Clark",
        "rating": 5,
        "comment": "Incredible sound and speed.",
        "createdAt": "2024-04-22T14:00:00Z"
      },
      {
        "user": "Kevin Wilson",
        "rating": 4.8,
        "comment": "Exotic design.",
        "createdAt": "2024-04-23T15:00:00Z"
      }
    ]
  },
  {
    "id": 19,
    "brand": "Lamborghini",
    "name": "Huracan",
    "type": "coupe",
    "year": 2023,
    "price": 260000,
    "pricePerDay": 430,
    "engine": "5.2L V10",
    "fuel": "Gasoline",
    "colors": ["Blue", "Black", "Yellow"],
    "rating": 4.9,
    "description": "The Lamborghini Huracan Evo delivers ferocious V10 power, aggressive styling, and advanced aerodynamics for a pure adrenaline-pumping supercar experience.",
    "images": [
      "/images/cars/lamborgini1.jpg",
      "/images/cars/lamborgini2.jpg",
      "/images/cars/lamborgini3.jpg"
    ],
    "reviews": [
      {
        "user": "James Wilson",
        "rating": 5,
        "comment": "Ferocious power!",
        "createdAt": "2024-04-24T16:00:00Z"
      },
      {
        "user": "Patricia Moore",
        "rating": 5,
        "comment": "Stunning and fast.",
        "createdAt": "2024-04-25T17:00:00Z"
      },
      {
        "user": "Emily Davis",
        "rating": 4.8,
        "comment": "Exotic performance.",
        "createdAt": "2024-04-26T18:00:00Z"
      }
    ]
  },
  {
    "id": 20,
    "brand": "Volvo",
    "name": "XC90",
    "type": "suv",
    "year": 2023,
    "price": 50000,
    "pricePerDay": 80,
    "engine": "2.0L Turbo 4-Cylinder",
    "fuel": "Gasoline",
    "colors": [ " White", "Blue"],
    "rating": 4.5,
    "description": "The Volvo XC90 prioritizes safety and luxury with its spacious three-row seating, advanced driver-assist systems, and elegant Scandinavian design.",
     "images": [
      "/images/cars/volvo1.jpg",
      "/images/cars/volvo2.jpg"
        ],
    "reviews": [
      {
        "user": "Anna Garcia",
        "rating": 4,
        "comment": "Safe and luxurious!",
        "createdAt": "2024-04-27T19:00:00Z"
      },
      {
        "user": "Robert Taylor",
        "rating": 5,
        "comment": "Excellent safety features.",
        "createdAt": "2024-04-28T20:00:00Z"
      },
      {
        "user": "Chris Lee",
        "rating": 4.5,
        "comment": "Comfortable family SUV.",
        "createdAt": "2024-04-29T21:00:00Z"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    await Car.deleteMany({});
    console.log('Cleared existing cars');

    await Car.insertMany(mockCars);
    console.log('Inserted mock cars');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
