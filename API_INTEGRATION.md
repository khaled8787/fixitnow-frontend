# FixItNow Frontend - API Integration

This document describes how the FixItNow frontend consumes and integrates with the backend REST API.

## Base API URL

The frontend uses the following environment variable for the backend API:

NEXT_PUBLIC_API_URL=your_backend_api_url

Axios is used as the main HTTP client. Authentication tokens are automatically attached to protected API requests through the Axios request interceptor.

## Authentication APIs

### Register

Frontend: Registration Page

Method: POST

Endpoint:

/api/api/auth/register

Purpose: Creates a new customer or technician account.

### Login

Frontend: Login Page

Method: POST

Endpoint:

/api/api/auth/login

Purpose: Authenticates the user and stores the JWT access token for authenticated requests.

## Service APIs

### Get All Services

Frontend: Home Page / Services Section / Services Page

Method: GET

Endpoint:

/api/api/services

Query Parameters:

- searchTerm
- categoryId
- isActive
- minPrice
- maxPrice

Purpose: Retrieves available services for browsing, searching, and filtering.

### Get Single Service

Frontend: Service Details Page

Method: GET

Endpoint:

/api/api/services/:id

Purpose: Retrieves complete information about a specific service, including its category and technician information.

## Technician APIs

### Get All Technicians

Frontend: Home Page / Services Page / Technicians Section

Method: GET

Endpoint:

/api/api/technicians

Query Parameters:

- searchTerm
- location
- isAvailable

Purpose: Retrieves technicians for listing, searching, and filtering.

### Get Single Technician

Frontend: Technician Details Page

Method: GET

Endpoint:

/api/api/technicians/:id

Purpose: Retrieves a technician profile, services, availability information, and related profile data.

## Category APIs

### Get Categories

Frontend: Services Page / Service Filters

Method: GET

Endpoint:

/api/api/categories

Purpose: Retrieves service categories for browsing and filtering services.

## Booking APIs

### Create Booking

Frontend: Booking Flow

Method: POST

Endpoint:

/api/api/bookings

Authentication: Required

Purpose: Creates a booking request for a selected service and technician.

### Get Bookings

Frontend: Customer Dashboard / My Bookings

Method: GET

Endpoint:

/api/api/bookings

Authentication: Required

Purpose: Retrieves booking information for the authenticated user.

### Get Booking Details

Frontend: Booking Details

Method: GET

Endpoint:

/api/api/bookings/:id

Authentication: Required

Purpose: Retrieves detailed information about a specific booking.

### Update Booking

Frontend: Customer / Booking Management

Method: PATCH

Endpoint:

/api/api/bookings/:id

Authentication: Required

Purpose: Updates booking information when permitted by the backend business rules.

### Update Booking Status

Frontend: Technician Dashboard

Method: PATCH

Endpoint:

/api/api/bookings/:id/status

Authentication: Required

Purpose: Allows technicians to update the status of their assigned bookings.

### Cancel Booking

Frontend: Customer Dashboard

Method: PATCH

Endpoint:

/api/api/bookings/:id/cancel

Authentication: Required

Purpose: Allows customers to cancel eligible bookings according to the booking status rules.

## Payment APIs

### Create Payment

Frontend: Payment Page / Pay Now Flow

Method: POST

Endpoint:

/api/api/payments/create

Authentication: Required

Purpose: Initiates the Stripe payment process for an eligible booking.

### Payment Success

Frontend Route:

/payment/success

Purpose: Displays the successful Stripe payment result and updates the relevant payment and booking information in the frontend.

### Payment Cancel

Frontend Route:

/payment/cancel

Purpose: Handles cancelled Stripe checkout sessions and provides a user-friendly cancellation message.

## Review APIs

### Get Reviews

Frontend: Service Details / Technician Details

Method: GET

Endpoint:

/api/api/reviews

Purpose: Retrieves reviews displayed in the frontend.

Reviews are filtered on the frontend where necessary so that service-specific pages display reviews related to the exact service.

### Create Review

Frontend: Customer Dashboard / Booking Review

Method: POST

Endpoint:

/api/api/reviews

Authentication: Required

Request Body:

{
  "bookingId": "booking-id",
  "rating": 5,
  "comment": "Excellent service"
}

Purpose: Allows a customer to submit a review for an eligible PAID booking.

### Update Review

Frontend: Customer Review Management

Method: PATCH

Endpoint:

/api/api/reviews/:id

Authentication: Required

Purpose: Allows the owner of a review to update the rating and comment.

### Delete Review

Frontend: Customer Review Management

Method: DELETE

Endpoint:

/api/api/reviews/:id

Authentication: Required

Purpose: Allows the owner of a review to delete their review.

## Admin APIs

### Admin Users

Frontend: Admin Dashboard / User Management

Method: GET

Endpoint:

/api/api/admin/users

Authentication: Admin only

Purpose: Retrieves users for administration and moderation.

### Ban / Unban User

Frontend: Admin User Management

Method: PATCH

Endpoint:

/api/api/admin/users/:id/status

Authentication: Admin only

Purpose: Allows administrators to manage user account status.

### Admin Bookings

Frontend: Admin Dashboard

Method: GET

Endpoint:

/api/api/admin/bookings

Authentication: Admin only

Purpose: Retrieves platform booking information for administration and monitoring.

### Admin Categories

Frontend: Admin Category Management

Method: GET

Endpoint:

/api/api/admin/categories

Authentication: Admin only

Purpose: Retrieves service categories for administration.

### Create Category

Frontend: Admin Category Management

Method: POST

Endpoint:

/api/api/admin/categories

Authentication: Admin only

Purpose: Creates a new service category.

## Authentication

Protected API requests use the JWT access token stored by the frontend authentication system.

The Axios request interceptor attaches the token to protected requests using the following authorization format:

Authorization: Bearer <access_token>

Role-based access is handled through the authenticated user's role and protected frontend routes.

## Error Handling

API errors are handled through user-friendly UI feedback.

Depending on the operation, errors are displayed using:

- Toast notifications
- Inline form validation messages
- Loading and error states
- Empty states
- Protected route handling
- Graceful error pages

This ensures that users receive clear feedback when an API request fails or when an operation is not permitted.

## API Integration Summary

| Frontend Feature | Method | Backend Endpoint |
|---|---|---|
| Register | POST | /api/api/auth/register |
| Login | POST | /api/api/auth/login |
| Get Services | GET | /api/api/services |
| Get Single Service | GET | /api/api/services/:id |
| Get Technicians | GET | /api/api/technicians |
| Get Single Technician | GET | /api/api/technicians/:id |
| Get Categories | GET | /api/api/categories |
| Create Booking | POST | /api/api/bookings |
| Get Bookings | GET | /api/api/bookings |
| Get Booking Details | GET | /api/api/bookings/:id |
| Update Booking | PATCH | /api/api/bookings/:id |
| Update Booking Status | PATCH | /api/api/bookings/:id/status |
| Cancel Booking | PATCH | /api/api/bookings/:id/cancel |
| Create Payment | POST | /api/api/payments/create |
| Get Reviews | GET | /api/api/reviews |
| Create Review | POST | /api/api/reviews |
| Update Review | PATCH | /api/api/reviews/:id |
| Delete Review | DELETE | /api/api/reviews/:id |
| Admin Users | GET | /api/api/admin/users |
| Ban / Unban User | PATCH | /api/api/admin/users/:id/status |
| Admin Bookings | GET | /api/api/admin/bookings |
| Admin Categories | GET | /api/api/admin/categories |
| Create Category | POST | /api/api/admin/categories |

## Frontend API Integration Architecture

The frontend follows this general flow:

User Interaction
↓
React / Next.js Component
↓
Service / API Function
↓
Axios HTTP Client
↓
JWT Authorization Header
↓
FixItNow Backend API
↓
PostgreSQL Database
↓
API Response
↓
Frontend State Update
↓
UI Feedback / Updated UI

The frontend uses backend APIs as the primary source of application data instead of relying on hardcoded service, technician, booking, or review data.