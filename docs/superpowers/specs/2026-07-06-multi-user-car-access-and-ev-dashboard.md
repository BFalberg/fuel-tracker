# Multi-user Car Access & EV-aware Dashboard

**Date:** 2026-07-06
**Branch:** dashboard-and-car-update

---

## Overview

Two related features:
1. Allow multiple users to access a single car, with owner and co-driver roles.
2. Fix the dashboard for electric vehicles, where per-refuel cost is always 0 due to subscription-based charging.

---

## Feature 1: Multi-user Car Access

### Problem

The `cars` table has a single `user_id` column, meaning only the car's creator can see it in the dashboard. There is no way to share a car with another user.

### Solution

Replace the single `user_id` ownership column with a `car_user` pivot table that supports many-to-many relationships with a role column.

### Roles

| Role | Permissions |
|---|---|
| `owner` | Full control: edit car, delete car, manage users (add/remove co-drivers), add/edit/delete refuels and expenses |
| `co_driver` | Can add refuels; read-only access to everything else (dashboard, car details, expenses) |

### Database

**New `car_user` pivot table:**
```
car_user
  id          - bigint, PK
  car_id      - FK → cars.id (cascade delete)
  user_id     - FK → users.id (cascade delete)
  role        - enum: 'owner' | 'co_driver'
  created_at
  updated_at
  UNIQUE(car_id, user_id)
```

**Migration steps:**
1. Create `car_user` table.
2. Copy all existing `cars.user_id` values into `car_user` as `role = 'owner'`.
3. Drop `user_id` from `cars` (remove from `$fillable` and model too).

### Models

- `Car::users()` → `belongsToMany(User)->withPivot('role')->withTimestamps()`
- `User::cars()` → `belongsToMany(Car)->withPivot('role')->withTimestamps()`
- `User::ownedCars()` → scoped to `role = 'owner'`
- `User::accessibleCars()` → all roles (used by dashboard and car list)

### Authorization

Update `CarPolicy` (currently all `false`):

| Method | Rule |
|---|---|
| `view` | User has any row in `car_user` for this car |
| `update` | User has `role = owner` |
| `delete` | User has `role = owner` |
| `manageUsers` | User has `role = owner` (custom policy method) |

### Backend Changes

- **`ListCars` action**: scope to `auth()->user()->accessibleCars()`.
- **`DashboardController`**: use `accessibleCars()` instead of `$user->cars()`.
- **`CreateCar` action**: after creating the car, insert an owner row into `car_user`.
- **`CarController`**: apply policy gates on `show`, `edit`, `update`, `destroy`.
- **`RefuelController@store`**: allow co-drivers (policy `view` check).
- **New `CarUserController`**:
  - `store(Request $request, Car $car)` — owner adds co-driver by email. Looks up user by email; returns 422 if not found. Attaches with `role = co_driver`.
  - `destroy(Car $car, User $user)` — owner removes a co-driver. Cannot remove self (the owner).

### UI

Add a **Users section** to `Cars/CarEdit.tsx`, rendered only when the authenticated user is the owner.

**Section contents:**
- List of current car users showing name, email, and role badge (Owner / Co-driver).
- Remove button on each co-driver row.
- "Add Co-driver" form with an email input and submit button.
  - Shows inline error if the email does not match any registered user.
  - On success, Inertia reloads the page to reflect the updated list.

The `CarEdit` controller method passes a `carUsers` prop (current users with role) and an `isOwner` boolean.

---

## Feature 2: EV-aware Dashboard

### Problem

`BuildDashboardStats` calculates all cost metrics from `refuels.total_price`. For EVs using subscription-based charging, every refuel entry has `total_price = 0`, making all cost cards show 0.

### Solution

When `car->is_electric` is `true`, source cost data from `car_expenses` where `expense_type = 'Abonnement'` (subscription). Distance data (from refuel mileage) is unchanged for both car types.

### Data Source by Car Type

| Stat | Gas car | EV |
|---|---|---|
| This Month cost | `SUM(refuels.total_price)` for current month | `SUM(car_expenses.amount)` where type = 'Abonnement' and `invoice_date` in current month |
| All time cost | `SUM(refuels.total_price)` | `SUM(car_expenses.amount)` where type = 'Abonnement' |
| Price per km | All-time refuel cost ÷ total km | All-time subscription cost ÷ total km |
| Monthly avg cost | Average monthly refuel spend | Average monthly subscription spend |
| Distance (all) | Derived from refuel mileage entries | Same |

### Backend Changes

In `BuildDashboardStats::handle()`, branch on `$car->is_electric`:
- If `true`: query `car_expenses` for subscription amounts.
- If `false`: keep existing refuel-based queries.

### UI

No UI changes required. The same 4 dashboard cards are used — only the numbers change for EVs.

---

## Out of Scope

- Invitation/acceptance flow (access is immediate on email match).
- Ownership transfer.
- Co-drivers adding or editing car expenses.
- EV dashboard changes when no subscription expenses exist (will show 0, same as today for gas cars with no refuels).
