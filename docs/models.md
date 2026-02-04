# Database Models

This document describes the data models used in the store-system database. For setup and configuration instructions, see [database.md](./database.md).

## Schema Organization

Models are organized into modular schema files located in `/packages/db/prisma/schema/`:

- **base.prisma**: Prisma client generator and datasource configuration
- **auth.prisma**: User authentication and access control models
- **hr.prisma**: Human resources and employee management models
- **sales.prisma**: Sales transactions and payment models
- **inventory.prisma**: Product inventory and warehouse logistics models

## Application Usage

| App | Main Focus | Key Models |
|-----|------------|------------|
| Admin Panel | Human Resources and Control | Employee, Payroll, Schedule, TimeOff |
| Store Front (POS) | Quick Transactions | Sale, SaleItem, Payment, Product |
| Warehouse App | Logistics and Stock | Product, StockLog, Transfer, Warehouse |

## Entity-Relationship Diagrams (ERD)

To view the detailed visual structure of each module, check the technical diagrams:

* **Authentication & HR**: [View auth.mermaid](./database/auth.mermaid)
* **Inventory Management**: [View inventory.mermaid](./database/inventory.mermaid)
* **Sales & Transactions**: [View sales.mermaid](./database/sales.mermaid)

---

## Authentication Module (auth.prisma)

### User

User accounts for system authentication and authorization.

**Fields:**
- `id` (String, PK): UUID
- `email` (String, Unique): User email address
- `password` (String): Hashed password
- `role` (String): User role - "USER" | "ADMIN" | "WAREHOUSE"
- `isActive` (Boolean): Account active status (default: false)
- `isVerified` (Boolean): Email verification status (default: false)
- `token` (String?, Unique): Password reset or verification token
- `tokenExpires` (DateTime?): Token expiration timestamp
- `createdAt` (DateTime): Account creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `employee` (Employee): Employee profile (required)

**Usage:**
- Login and authentication
- Role-based access control (RBAC)
- Password reset functionality
- Email verification

---

## Human Resources Module (hr.prisma)

### Employee

Employee profiles with personal and payroll information.

**Fields:**
- `id` (String, PK): UUID
- `userId` (String, FK, Unique): Reference to User
- `name` (String): First name
- `lastname` (String): Last name
- `nss` (String, Unique): Social Security Number (Mexico: NSS)
- `rfc` (String, Unique): Tax ID (Mexico: RFC)
- `address` (String): Full address
- `salary` (Float): Base salary (default: 0.0)
- `vacationDays` (Int): Available vacation days (default: 0)
- `birthdate` (DateTime): Date of birth
- `isRehired` (Boolean): Rehired employee flag (default: false)
- `createdAt` (DateTime): Record creation timestamp

**Relations:**
- `user` (User): Associated user account
- `payrolls` (Payroll[]): Payroll records
- `schedules` (Schedule[]): Work schedules
- `timeOffs` (TimeOff[]): Time-off requests
- `salaryLogs` (SalaryLog[]): Salary change history
- `attendanceLogs` (AttendanceLog[]): Attendance records
- `performanceWarnings` (PerformanceWarning[]): Performance warnings
- `sentSwaps` (ShiftSwap[]): Shift swap requests sent
- `receivedSwaps` (ShiftSwap[]): Shift swap requests received
- `sales` (Sale[]): Sales processed by employee
- `stockLogs` (StockLog[]): Stock movements recorded
- `transfers` (Transfer[]): Warehouse transfers managed
- `discountsAuthorized` (Discount[]): Discounts authorized
- `refundsAuthorized` (Refund[]): Refunds authorized

**Usage:**
- HR management and payroll
- Employee identification
- Attendance tracking
- Sales and inventory attribution

### ShiftSwap

Shift swap requests between employees.

**Fields:**
- `id` (String, PK): UUID
- `requesterId` (String, FK): Employee requesting the swap
- `receiverId` (String, FK): Employee receiving the request
- `requesterShiftId` (String): Shift ID to give up
- `receiverShiftId` (String): Shift ID to receive in return
- `status` (String): "PENDING_RECEIVER" | "PENDING_ADMIN" | "APPROVED" | "REJECTED" | "CANCELLED"
- `reason` (String?): Reason for swap request
- `authorizedBy` (String?): Admin ID who approved
- `createdAt` (DateTime): Request creation timestamp

**Relations:**
- `requester` (Employee): Employee requesting swap
- `receiver` (Employee): Employee receiving request

**Usage:**
- Employee self-service shift management
- Approval workflow for shift changes

### Schedule

Employee work schedules by week.

**Fields:**
- `id` (String, PK): UUID
- `weekNumber` (Int): Week number of the year
- `year` (Int): Year
- `dayOfWeek` (Int): Day of week (0-6)
- `startTime` (String?): Shift start time (HH:MM format)
- `endTime` (String?): Shift end time (HH:MM format)
- `isDayOff` (Boolean): Day off flag (default: false)
- `note` (String?): Additional notes
- `employeeId` (String, FK): Reference to Employee

**Relations:**
- `employee` (Employee): Associated employee

**Usage:**
- Weekly schedule management
- Shift planning and rotation

### AttendanceLog

Employee attendance and punctuality tracking.

**Fields:**
- `id` (String, PK): UUID
- `date` (DateTime): Attendance date
- `type` (String): "PRESENT" | "LATE" | "ABSENT"
- `minutesLate` (Int?): Minutes late (if applicable)
- `reason` (String?): Reason for absence/lateness
- `createdAt` (DateTime): Record creation timestamp
- `employeeId` (String, FK): Reference to Employee

**Relations:**
- `employee` (Employee): Associated employee

**Usage:**
- Attendance tracking
- Punctuality monitoring
- Payroll deductions

### PerformanceWarning

Performance issues and disciplinary warnings.

**Fields:**
- `id` (String, PK): UUID
- `date` (DateTime): Warning date (default: now)
- `severity` (String): "LOW" | "MEDIUM" | "HIGH"
- `description` (String): Warning description
- `createdAt` (DateTime): Record creation timestamp
- `employeeId` (String, FK): Reference to Employee

**Relations:**
- `employee` (Employee): Associated employee

**Usage:**
- Performance management
- Disciplinary tracking
- HR compliance

### SalaryLog

Salary change history for auditing.

**Fields:**
- `id` (String, PK): UUID
- `oldSalary` (Float): Previous salary amount
- `newSalary` (Float): New salary amount
- `changeReason` (String): Reason for salary change
- `effectiveDate` (DateTime): Effective date of change (default: now)
- `employeeId` (String, FK): Reference to Employee

**Relations:**
- `employee` (Employee): Associated employee

**Usage:**
- Salary change tracking
- Audit trail for payroll
- Historical compensation data

### TimeOff

Employee time-off requests and approvals.

**Fields:**
- `id` (String, PK): UUID
- `startDate` (DateTime): Start date of time off
- `endDate` (DateTime): End date of time off
- `type` (String): "VACATION" | "SICK" | "PERSONAL"
- `status` (String): "PENDING" | "APPROVED" | "REJECTED" (default: "PENDING")
- `reason` (String?): Reason for request
- `createdAt` (DateTime): Request creation timestamp
- `employeeId` (String, FK): Reference to Employee

**Relations:**
- `employee` (Employee): Associated employee

**Usage:**
- Vacation management
- Sick leave tracking
- Time-off approval workflow

### Payroll

Payroll records for employee compensation.

**Fields:**
- `id` (String, PK): UUID
- `period` (String): Payroll period (e.g., "2026-01")
- `baseSalary` (Float): Base salary amount
- `bonuses` (Float): Bonus amount (default: 0.0)
- `deductions` (Float): Deductions amount (default: 0.0)
- `netSalary` (Float): Net salary after bonuses/deductions
- `status` (String): "PENDING" | "PAID" | "CANCELLED" (default: "PENDING")
- `paidAt` (DateTime?): Payment date
- `createdAt` (DateTime): Record creation timestamp
- `employeeId` (String, FK): Reference to Employee

**Relations:**
- `employee` (Employee): Associated employee

**Usage:**
- Payroll processing
- Compensation calculation
- Payment tracking

---

## Sales Module (sales.prisma)

### Sale

Sales transactions at the point of sale.

**Fields:**
- `id` (String, PK): UUID
- `total` (Float): Total amount including tax
- `subtotal` (Float): Subtotal before tax
- `tax` (Float): Tax amount (default: 0.0)
- `status` (String): "COMPLETED" | "CANCELLED" | "REFUNDED" (default: "COMPLETED")
- `ticketPrinted` (Boolean): Ticket print status (default: false)
- `createdAt` (DateTime): Transaction timestamp
- `employeeId` (String, FK): Employee who processed the sale

**Relations:**
- `employee` (Employee): Cashier/sales associate
- `items` (SaleItem[]): Products sold
- `payments` (Payment[]): Payment methods used
- `discounts` (Discount[]): Applied discounts
- `refunds` (Refund[]): Associated refunds

**Usage:**
- Point of sale transactions
- Sales reporting
- Revenue tracking

### SaleItem

Individual products in a sale transaction.

**Fields:**
- `id` (String, PK): UUID
- `quantity` (Int): Quantity sold
- `unitPrice` (Float): Price per unit at time of sale
- `subtotal` (Float): Line item subtotal (quantity × unitPrice)
- `saleId` (String, FK): Reference to Sale
- `productId` (String, FK): Reference to Product

**Relations:**
- `sale` (Sale): Parent sale transaction
- `product` (Product): Product sold

**Usage:**
- Sale line items
- Product sales analysis
- Inventory deduction

### Payment

Payment methods used for sales.

**Fields:**
- `id` (String, PK): UUID
- `amount` (Float): Payment amount
- `method` (String): "CASH" | "CARD" | "TRANSFER"
- `reference` (String?): Payment reference (e.g., card transaction ID)
- `createdAt` (DateTime): Payment timestamp
- `saleId` (String, FK): Reference to Sale

**Relations:**
- `sale` (Sale): Associated sale

**Usage:**
- Payment processing
- Cash register reconciliation
- Payment method reporting

### Discount

Discounts applied to sales.

**Fields:**
- `id` (String, PK): UUID
- `amount` (Float): Discount amount
- `type` (String): "PERCENTAGE" | "FIXED"
- `reason` (String?): Discount reason
- `createdAt` (DateTime): Discount creation timestamp
- `saleId` (String, FK): Reference to Sale
- `authorizedBy` (String?, FK): Employee who authorized (admin)

**Relations:**
- `sale` (Sale): Sale with discount applied
- `authorizer` (Employee?): Admin who authorized

**Usage:**
- Promotional discounts
- Employee/senior citizen discounts
- Authorization tracking

### Refund

Refund transactions for returned items.

**Fields:**
- `id` (String, PK): UUID
- `amount` (Float): Refund amount
- `reason` (String): Reason for refund
- `restockCompleted` (Boolean): Restock status (default: false)
- `createdAt` (DateTime): Refund creation timestamp
- `saleId` (String, FK): Reference to original Sale
- `authorizedBy` (String?, FK): Employee who authorized (admin)

**Relations:**
- `sale` (Sale): Original sale transaction
- `authorizer` (Employee?): Admin who authorized

**Usage:**
- Product returns
- Refund processing
- Inventory restocking

---

## Inventory Module (inventory.prisma)

### Product

Products available for sale.

**Fields:**
- `id` (String, PK): UUID
- `name` (String): Product name
- `description` (String?): Product description
- `sku` (String, Unique): Stock Keeping Unit
- `barcode` (String?, Unique): Barcode/UPC
- `price` (Float): Selling price
- `cost` (Float): Product cost (default: 0.0)
- `stock` (Int): Current stock level (default: 0)
- `minStock` (Int): Minimum stock threshold (default: 5)
- `maxStock` (Int?): Maximum stock capacity
- `category` (String?): Product category
- `isActive` (Boolean): Product active status (default: true)
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations:**
- `stockLogs` (StockLog[]): Stock movement history
- `transfers` (TransferItem[]): Warehouse transfers
- `saleItems` (SaleItem[]): Sales records

**Usage:**
- Product catalog
- Inventory management
- Point of sale
- Low stock alerts

### StockLog

Comprehensive stock movement tracking.

**Fields:**
- `id` (String, PK): UUID
- `quantity` (Int): Quantity (positive for entry, negative for exit)
- `type` (String): "ENTRY" | "EXIT" | "ADJUSTMENT" | "SALE" | "TRANSFER" | "DAMAGE" | "DONATION" | "EXPIRATION"
- `reason` (String?): Movement reason/notes
- `previousStock` (Int): Stock level before movement
- `newStock` (Int): Stock level after movement
- `createdAt` (DateTime): Movement timestamp
- `productId` (String, FK): Reference to Product
- `employeeId` (String, FK): Employee who recorded movement
- `warehouseId` (String?, FK): Associated warehouse

**Relations:**
- `product` (Product): Product affected
- `employee` (Employee): Employee responsible
- `warehouse` (Warehouse?): Warehouse location

**Usage:**
- Inventory auditing
- Stock movement tracking
- Loss prevention (damage, theft)
- Automatic sale tracking

### Warehouse

Physical storage locations.

**Fields:**
- `id` (String, PK): UUID
- `name` (String): Warehouse name
- `location` (String): Physical address
- `isActive` (Boolean): Warehouse active status (default: true)
- `createdAt` (DateTime): Record creation timestamp

**Relations:**
- `stockLogs` (StockLog[]): Stock movements
- `transfersFrom` (Transfer[]): Outbound transfers
- `transfersTo` (Transfer[]): Inbound transfers

**Usage:**
- Multi-location inventory
- Warehouse management
- Transfer logistics

### Transfer

Inter-warehouse product transfers.

**Fields:**
- `id` (String, PK): UUID
- `status` (String): "PENDING" | "IN_TRANSIT" | "COMPLETED" | "CANCELLED" (default: "PENDING")
- `notes` (String?): Transfer notes
- `createdAt` (DateTime): Transfer creation timestamp
- `completedAt` (DateTime?): Completion timestamp
- `fromWarehouseId` (String, FK): Source warehouse
- `toWarehouseId` (String, FK): Destination warehouse
- `employeeId` (String, FK): Employee managing transfer

**Relations:**
- `fromWarehouse` (Warehouse): Source location
- `toWarehouse` (Warehouse): Destination location
- `employee` (Employee): Transfer manager
- `items` (TransferItem[]): Products being transferred

**Usage:**
- Stock rebalancing
- Store replenishment
- Warehouse logistics

### TransferItem

Individual products in a warehouse transfer.

**Fields:**
- `id` (String, PK): UUID
- `quantity` (Int): Quantity to transfer
- `transferId` (String, FK): Reference to Transfer
- `productId` (String, FK): Reference to Product

**Relations:**
- `transfer` (Transfer): Parent transfer
- `product` (Product): Product being transferred

**Usage:**
- Transfer line items
- Multi-product transfers
- Transfer verification

---

## Common Patterns

### Timestamps

Most models include timestamp fields for auditing:
- `createdAt`: Record creation time
- `updatedAt`: Last modification time (auto-updated)
- `paidAt`, `completedAt`, etc.: Status-specific timestamps

### Status Enums

Many models use status fields with predefined values:
- **Sale**: COMPLETED, CANCELLED, REFUNDED
- **Transfer**: PENDING, IN_TRANSIT, COMPLETED, CANCELLED
- **TimeOff**: PENDING, APPROVED, REJECTED
- **Payroll**: PENDING, PAID, CANCELLED

### Authorization Tracking

Models that require approval include authorization fields:
- `Discount.authorizedBy` → Employee ID
- `Refund.authorizedBy` → Employee ID
- `ShiftSwap.authorizedBy` → Admin ID

### Soft Deletes

Rather than hard deletes, models use status flags:
- `User.isActive`
- `Product.isActive`
- `Warehouse.isActive`

---

## Type System

The `@store-system/types` package provides domain types independent of Prisma:

```typescript
import type { User, Employee, UserWithEmployee } from '@store-system/types';
```

This separation ensures:
- Types can be used without Prisma dependency
- Domain logic remains decoupled from ORM
- Easier testing and mocking

See `/packages/types/src/` for available type definitions.