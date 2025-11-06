# Admin Dashboard Implementation Steps

## 1. Update Header Component
- [ ] Add admin dashboard link in Header.tsx, visible only to users with 'admin' role

## 2. Create Middleware for Admin Routes
- [ ] Create middleware.ts to protect /admin/* routes, ensuring only 'admin' role can access

## 3. Create Main Admin Dashboard Page
- [ ] Create app/admin/page.tsx with overview stats (total users, cars, bookings)

## 4. Create User Management Page
- [ ] Create app/admin/users/page.tsx for listing and managing users

## 5. Create Car Management Page
- [ ] Create app/admin/cars/page.tsx for listing and managing cars

## 6. Create Booking Management Page
- [ ] Create app/admin/bookings/page.tsx for listing and managing bookings

## 7. Create Admin Users API
- [ ] Create app/api/users/route.ts for admin to GET all users, DELETE users, etc.

## 8. Update Cars API for Admin
- [ ] Update app/api/cars/route.ts to include admin-only operations (delete, edit all cars)

## 9. Update Bookings API for Admin
- [ ] Update app/api/bookings/route.ts to include admin operations (view all bookings, cancel, etc.)

## 10. Update Main TODO.md
- [ ] Mark admin dashboard as completed in TODO.md
