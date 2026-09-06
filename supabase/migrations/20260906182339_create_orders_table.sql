/*
# Create orders table for Wood Pecker delivery app

1. New Tables
- `orders`
  - `id` (text, primary key) — order number shown to customer
  - `customer_name` (text) — full name from checkout form
  - `phone` (text) — customer phone number
  - `address` (text) — delivery address
  - `delivery_mode` (text) — "livraison" or "retrait"
  - `payment_mode` (text) — "livraison" (cash on delivery)
  - `items` (jsonb) — array of {id, name, price, quantity} for each ordered product
  - `total` (integer) — total price in DA
  - `status` (text) — order status, defaults to "Préparation"
  - `created_at` (timestamptz) — when the order was placed
2. Security
- Enable RLS on `orders`.
- Allow anon + authenticated CRUD because the app has no sign-in (single-tenant, public data).
*/

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL DEFAULT '',
  delivery_mode text NOT NULL DEFAULT 'livraison',
  payment_mode text NOT NULL DEFAULT 'livraison',
  items jsonb NOT NULL DEFAULT '[]',
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Préparation',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
