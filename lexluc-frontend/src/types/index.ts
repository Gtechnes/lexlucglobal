// User and Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'BOOKING_MANAGER' | 'USER';
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Services
export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  content?: string;
  icon?: string;
  image?: string;
  order: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Tours
export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  destination: string;
  duration: number;
  price: number;
  maxParticipants?: number;
  isActive: boolean;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary?: string;
  startDate?: string;
  endDate?: string;
  serviceId?: string;
  service?: Service;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Bookings
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  referenceNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfParticipants: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
  notes?: string;
  userId?: string;
  tourId: string;
  tour?: Tour;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfParticipants: number;
  totalPrice: number;
  tourId: string;
  specialRequests?: string;
}

// Blog Posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  category?: string;
  isPublished: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Messages
export type ContactStatus = 'NEW' | 'READ' | 'RESPONDED';

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}
