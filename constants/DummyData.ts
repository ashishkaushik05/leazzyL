import { PropertyType } from '@/components/PropertyCard';

// User profile data
export interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  location: string;
  savedProperties: string[];
  viewingHistory: string[];
  listings: string[];
  bookings: string[];
  isVerified: boolean;
  joinedDate: string;
}

// Extended property data with additional details for property detail page
interface ExtendedPropertyType extends PropertyType {
  rating?: number;
  address?: string;
  specifications?: {
    bedrooms?: number;
    kitchen?: number;
    bathrooms?: number;
  };
  reviews?: {
    id: string;
    user: string;
    location: string;
    date: string;
    rating: number;
    comment: string;
    userImg?: string;
  }[];
  cancellation?: string;
}

// Dummy properties data
// Dummy user data
export const DUMMY_USER: UserType = {
  id: 'user1',
  name: 'himanshu pal',
  email: 'himanshupal11428@gmail.com',
  phone: '+91 8607201486',
  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  location: 'Chandigarh, India',
  savedProperties: ['1', '3'],
  viewingHistory: ['2', '1'],
  listings: [],
  bookings: ['3'],
  isVerified: true,
  joinedDate: 'May 2023'
};

export const DUMMY_PROPERTIES: ExtendedPropertyType[] = [
  {
    id: '1',
    title: 'Pinewood Heights',
    price: 10592,
    location: 'Aerocity',
    bhk: '2 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
    amenities: ['Television', 'Wifi', 'AC', 'Parking', 'Security', 'Laundry'],
    address: 'Gated Society, Parking, Near Metro',
    rating: 4.32,
    specifications: {
      bedrooms: 2,
      kitchen: 1,
      bathrooms: 2
    },
    reviews: [
      {
        id: '1',
        user: 'Anna Marie',
        location: 'New Delhi, India',
        date: '1 week ago',
        rating: 4.32,
        comment: 'Highly recommended! Clean, modern, and well-connected to key areas.',
        userImg: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      {
        id: '2',
        user: 'Anna Marie',
        location: 'New Delhi, India',
        date: '1 week ago',
        rating: 4.32,
        comment: 'Highly recommended! Clean, modern, and well-connected to key areas.',
        userImg: 'https://randomuser.me/api/portraits/women/32.jpg'
      }
    ],
    cancellation: 'Free cancellation before 5 Jan 2025'
  },
  {
    id: '2',
    title: 'Yoooo Heights',
    price: 22443,
    location: 'Aerocity',
    bhk: '6 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
    amenities: ['Television', 'Wifi', 'Refrigerator', 'Laundry'],
    address: 'Gated Society, Parking, Near Metro',
    rating: 4.4,
    specifications: {
      bedrooms: 6,
      kitchen: 2,
      bathrooms: 3
    },
    reviews: [
      {
        id: '1',
        user: 'John Smith',
        location: 'Mumbai, India',
        date: '2 weeks ago',
        rating: 4.4,
        comment: 'Excellent property! Spacious and well-maintained.',
        userImg: 'https://randomuser.me/api/portraits/men/41.jpg'
      }
    ],
    cancellation: 'Free cancellation before 10 Jan 2025'
  },
  {
    id: '3',
    title: 'Lakeside Towers',
    price: 15000,
    location: 'Near Kharar area',
    bhk: '3 BHK',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
    amenities: ['Television', 'Wifi', 'Gym', 'Swimming Pool', 'Laundry'],
    address: 'Lake View Society, Near Kharar',
    rating: 4.0,
    specifications: {
      bedrooms: 3,
      kitchen: 1,
      bathrooms: 2
    },
    reviews: [
      {
        id: '1',
        user: 'Priya Sharma',
        location: 'Chandigarh, India',
        date: '1 month ago',
        rating: 4.0,
        comment: 'Beautiful view of the lake! Very peaceful location.',
        userImg: 'https://randomuser.me/api/portraits/women/44.jpg'
      }
    ],
    cancellation: 'Free cancellation before 15 Jan 2025'
  }
];