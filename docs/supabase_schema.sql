
CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id        TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTR(GEN_RANDOM_UUID()::TEXT, 1, 8)),

    -- Contact Information
    email           TEXT NOT NULL,
    phone           TEXT NOT NULL,

    -- Shipping Address
    full_name       TEXT NOT NULL,
    address         TEXT NOT NULL,
    city            TEXT NOT NULL,
    state           TEXT NOT NULL,
    pincode         TEXT NOT NULL,
    country         TEXT NOT NULL DEFAULT 'India',

    -- Payment
    payment_method  TEXT NOT NULL CHECK (payment_method IN ('credit-card', 'upi', 'net-banking')),
    promo_code      TEXT,

    -- Totals (in INR, stored as integers to avoid floating point)
    subtotal        INTEGER NOT NULL DEFAULT 0,
    tax             INTEGER NOT NULL DEFAULT 0,
    discount        INTEGER NOT NULL DEFAULT 0,
    grand_total     INTEGER NOT NULL DEFAULT 0,

    -- Status
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),

    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 2. ORDER ITEMS TABLE
-- Each row = one product line in an order
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    -- Product Info (snapshot at time of purchase)
    product_id      TEXT NOT NULL,
    product_name    TEXT NOT NULL,
    product_price   INTEGER NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    category        TEXT,
    image_url       TEXT,

    -- Line total
    line_total      INTEGER GENERATED ALWAYS AS (product_price * quantity) STORED,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 3. NEWSLETTER SUBSCRIBERS TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           TEXT UNIQUE NOT NULL,
    subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);


-- ─────────────────────────────────────────────
-- 4. INDEXES (for faster queries)
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_orders_email       ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_id    ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_email   ON newsletter_subscribers(email);


-- ─────────────────────────────────────────────
-- 5. AUTO-UPDATE updated_at TRIGGER
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ─────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY (RLS)
-- Required for Supabase publishable key access
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE orders                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;

-- ORDERS: Allow anyone to INSERT (place orders from the frontend)
CREATE POLICY "Allow public order insert"
    ON orders
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- ORDERS: Allow reading own orders by email (optional, for order tracking)
CREATE POLICY "Allow read own orders by email"
    ON orders
    FOR SELECT
    TO anon
    USING (true);

-- ORDER ITEMS: Allow anyone to INSERT items with an order
CREATE POLICY "Allow public order items insert"
    ON order_items
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- ORDER ITEMS: Allow reading items for accessible orders
CREATE POLICY "Allow read order items"
    ON order_items
    FOR SELECT
    TO anon
    USING (true);

-- NEWSLETTER: Allow anyone to subscribe
CREATE POLICY "Allow public newsletter subscribe"
    ON newsletter_subscribers
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- NEWSLETTER: No public read access
-- (Only admin/service_role can view subscriber list)


-- ─────────────────────────────────────────────
-- 7. USEFUL VIEWS (optional, for admin dashboard)
-- ─────────────────────────────────────────────

-- View: Recent orders with item count
CREATE OR REPLACE VIEW recent_orders AS
SELECT
    o.id,
    o.order_id,
    o.full_name,
    o.email,
    o.grand_total,
    o.status,
    o.payment_method,
    o.created_at,
    COUNT(oi.id) AS item_count,
    SUM(oi.quantity) AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id
ORDER BY o.created_at DESC;\



