# System Requirements Specification

## ADMIN PANEL

### Admin Actions

* [ ] Admin can register
* [ ] Admin can register employees
* [ ] Admin can modify permissions
* [ ] User/Admin can login
* [ ] Admin can update employees' personal data
* [ ] User/Admin can change their password
* [ ] Admin can register days off

### User (Employee) Actions

* [ ] User can access their profile
* [ ] User can check available days off
* [ ] User can check overtime
* [ ] User can check schedule
* [ ] User can download payroll

---

## STORE FRONT (Sales POS)

### Functional Requirements

* [ ] User can add product by code
* [ ] User can scan products via barcode
* [ ] Admin can cancel a product from a transaction
* [ ] Admin can add discounts to products
* [ ] User can select payment method
* [ ] Admin can perform a cash audit
* [ ] *Tentative (Excluded for now): Invoicing/Facturación*

### System Logic

* System will discount product from inventory upon sale
* System will calculate the transaction total
* System will apply discounts if applicable
* System can process refunds and add products back to inventory
* System will print a physical or digital ticket

---

## WAREHOUSE-APP (Bodega)

### Functional Requirements

* [ ] User can update inventory (input product by SKU or barcode scanning)
* [ ] User can discount products from inventory (damage, donation, or expiration)
* [ ] User can request new products from the Main Warehouse
* [ ] User can confirm receipt of items sent from the Main Warehouse
* [ ] User can search and filter inventory by category or stock status
* [ ] Admin can generate reports on inventory movement and loss (mermas)

### System Logic

* System will discount products automatically when sold via POS
* System will alert when stock falls below a minimum threshold
* System will log every manual adjustment for audit purposes (who, when, and why)
* System will prevent discounts if the resulting stock would be negative
* System will update the status of internal requests (Pending, In Transit, Delivered)
