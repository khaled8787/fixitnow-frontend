# FixItNow - Home Service Marketplace

FixItNow is a modern home service marketplace where customers can discover services, choose technicians, book services, make secure online payments, and leave reviews. The platform provides separate experiences and dashboards for Customers, Technicians, and Admins.

## Live Links

 Frontend: https://fixitnow-frontend-nxmxv36e7-khaled-mahmuds-projects-f3e2de07.vercel.app
 Backend API: https://fixitnow-backend-gz17.onrender.com
 GitHub Repository: https://github.com/khaled8787/fixitnow-frontend
 Demo Video: https://drive.google.com/file/d/1K4TLvv30sJ9ylnP8vIKyqMMn3Hmy1Tkz/view?usp=sharing

## Project Overview

FixItNow connects customers with professional technicians for different home services such as plumbing, electrical repair, painting, cleaning, appliance repair, and other maintenance services.

The frontend is built with Next.js and communicates with a dedicated REST API backend. The application provides role-based access, protected routes, real-time API-driven data, booking management, reviews, and Stripe payment integration.

## User Roles

### Customer

Customers can:

 Register and login
 Browse available services
 Search and filter services
 View technician profiles
 Create service bookings
 View booking history
 Cancel eligible bookings
 Make secure Stripe payments
 Submit reviews for eligible paid bookings
 Edit and delete their reviews
 Manage their dashboard

### Technician

Technicians can:

 Login securely
 View their dashboard
 Manage their profile
 Manage service-related information
 View assigned bookings
 Update booking statuses
 Manage their availability
 Monitor their service activities

### Admin

Admins can:

 Access the admin dashboard
 Manage users
 Ban or unban users
 Monitor bookings
 Manage service categories
 Monitor overall platform activity

## Key Features

 Modern responsive user interface
 Next.js App Router architecture
 TypeScript based development
 JWT authentication
 Role-based authorization
 Protected routes
 Customer, Technician, and Admin dashboards
 Service search and filtering
 Technician search and filtering
 Service details
 Technician details
 Complete booking workflow
 Booking status management
 Booking cancellation
 Customer review system
 Review CRUD operations
 Stripe payment integration
 Payment success and cancellation pages
 API-driven dynamic data
 Axios API integration
 TanStack Query for server-state management
 Form validation
 Toast notifications
 Loading states
 Empty states
 API error handling
 Responsive design
 Animated UI interactions
 Graceful error pages

## Technology Stack

### Frontend

 Next.js
 React
 TypeScript
 Tailwind CSS
 Framer Motion

### State Management and Data Fetching

 TanStack React Query
 Zustand
 Axios

### Authentication

 JWT
 HTTP Authorization headers
 Role-based route protection

### Payment

 Stripe Checkout

### Validation and Forms

 React Hook Form
 Zod

### UI and Utilities

 Lucide React
 Swiper.js
 js-cookie

## API Integration

The frontend consumes data from the FixItNow backend REST API.

Main API modules include:

 Authentication
 Services
 Categories
 Technicians
 Bookings
 Payments
 Reviews
 Admin

Detailed API integration documentation is available in:

`API_INTEGRATION.md`

## Main API Endpoints

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/api/api/auth/register` |
| Login | POST | `/api/api/auth/login` |
| Services | GET | `/api/api/services` |
| Service Details | GET | `/api/api/services/:id` |
| Technicians | GET | `/api/api/technicians` |
| Technician Details | GET | `/api/api/technicians/:id` |
| Categories | GET | `/api/api/categories` |
| Create Booking | POST | `/api/api/bookings` |
| Get Bookings | GET | `/api/api/bookings` |
| Booking Details | GET | `/api/api/bookings/:id` |
| Update Booking | PATCH | `/api/api/bookings/:id` |
| Update Booking Status | PATCH | `/api/api/bookings/:id/status` |
| Cancel Booking | PATCH | `/api/api/bookings/:id/cancel` |
| Create Payment | POST | `/api/api/payments/create` |
| Reviews | GET | `/api/api/reviews` |
| Create Review | POST | `/api/api/reviews` |
| Update Review | PATCH | `/api/api/reviews/:id` |
| Delete Review | DELETE | `/api/api/reviews/:id` |

## Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=https://fixitnow-backend-gz17.onrender.com


Installation

Clone the repository:

git clone https://github.com/khaled8787/fixitnow-frontend.git

Navigate to the project directory:

cd fixitnow-frontend

Install dependencies:

npm install

Create the environment file:

.env.local

Add the required environment variables:

NEXT_PUBLIC_API_URL=https://fixitnow-backend-gz17.onrender.com

Start the development server:

npm run dev

The application will be available at:

http://localhost:3000
Production Build

To create a production build:

npm run build

To start the production server:

npm start
Authentication Flow

The application uses JWT-based authentication.

After successful login:

The backend authenticates the user.
An access token is returned.
The frontend stores the access token.
Axios automatically attaches the token to protected API requests.
The backend verifies the token and user role.
The frontend displays role-specific content and dashboards.

Protected requests use:

Authorization: Bearer <access_token>
Booking Flow

The main customer booking flow is:

Browse Services

Select Service

Choose Technician

Select Date and Time

Enter Address and Notes

Create Booking

Booking Confirmation

Payment

Stripe Checkout

Payment Success / Cancel
Payment Integration

FixItNow uses Stripe for real online payment processing.

Customers can pay for eligible bookings through Stripe Checkout.

Payment flow:

Customer Booking

Pay Now

Backend Payment API

Stripe Checkout

Customer Completes Payment

Payment Success / Cancel

Frontend Result Page

Fake or simulated payments are not used.

Review System

Customers can submit reviews for eligible paid bookings.

Review features include:

Create review
Update review
Delete review
Rating system
Written comments
Service-related review display
Error Handling

The frontend provides user-friendly feedback for API and application errors.

Error handling includes:

Toast notifications
Inline validation messages
Loading states
Empty states
API error messages
Authentication error handling
Protected route handling
Custom error pages
Graceful 404 handling
Graceful 500-level error handling

The goal is to ensure users always receive clear feedback instead of seeing unexpected application failures.

Responsive Design

The application is designed to work across:

Mobile devices
Tablets
Laptops
Desktop screens

Responsive layouts and components are used throughout the application to provide a consistent experience across different screen sizes.

Project Structure
fixitnow-frontend/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── auth/
│   │   ├── services/
│   │   ├── technicians/
│   │   ├── dashboard/
│   │   ├── payment/
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── services/
│   │   ├── technicians/
│   │   ├── booking/
│   │   └── shared/
│   │
│   ├── services/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── payment/
│   │   ├── review/
│   │   ├── service/
│   │   └── technician/
│   │
│   ├── lib/
│   │   └── axios.ts
│   │
│   ├── hooks/
│   │
│   ├── providers/
│   │
│   └── types/
│
├── API_INTEGRATION.md
├── README.md
├── package.json
├── tsconfig.json
└── next.config.ts
Performance and User Experience

The application focuses on a smooth user experience through:

Optimized image handling
Responsive layouts
Server-side and client-side rendering where appropriate
React Query caching
Loading states
Error states
Animated transitions
Reusable components
API-driven content
Security

The frontend follows basic security practices including:

JWT authentication
Protected routes
Role-based access control
Secure API communication
Environment variables for configuration
No sensitive secrets committed to the repository
Backend-side authorization for protected operations
Admin Demo Credentials

Use the following credentials for evaluation:

Email: admin@fixitnow.com
Password: Admin@12345


Demo Video

The demo video demonstrates:

Project overview
Next.js architecture
Customer workflow
Technician workflow
Admin workflow
Service management
Booking process
Review CRUD operations
Validation and error handling
Stripe payment flow
Payment success/cancel handling
A technical challenge and its solution

Demo Video:

https://drive.google.com/file/d/1K4TLvv30sJ9ylnP8vIKyqMMn3Hmy1Tkz/view?usp=sharing

Deployment

The frontend is deployed using Vercel.

The backend API is deployed separately and consumed by the frontend through the configured API environment variable.

API Documentation

Detailed API integration information can be found in:

API_INTEGRATION.md

Commit History

The project follows meaningful and descriptive commit messages following a conventional style.

Examples:

feat: add service search and filtering
feat: implement customer booking flow
feat: integrate stripe checkout
feat: add technician dashboard
feat: implement review CRUD
fix: resolve authentication token handling
fix: improve booking validation
refactor: improve API service structure
Future Improvements

Possible future improvements include:

Real-time booking notifications
Technician location tracking
Advanced service recommendations
Push notifications
In-app messaging
More advanced analytics
Multi-language support
Author

Khaled Mahmud

Frontend Developer

Built with Next.js, TypeScript, and modern web technologies.