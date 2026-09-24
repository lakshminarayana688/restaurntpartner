import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from localStorage (user configured in app) or Vite .env
const getSavedConfig = () => {
  const localUrl = localStorage.getItem('feedo_supabase_url');
  const localKey = localStorage.getItem('feedo_supabase_key');

  const url = localUrl || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = localKey || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return { url, key, isConfigured: Boolean(url && key && !url.includes('YOUR_PROJECT_ID')) };
};

export const isSupabaseConfigured = (): boolean => {
  return getSavedConfig().isConfigured;
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSavedConfig();
  if (!config.isConfigured) return null;

  if (!clientInstance) {
    clientInstance = createClient(config.url, config.key, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return clientInstance;
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('feedo_supabase_url', url.trim());
  localStorage.setItem('feedo_supabase_key', key.trim());
  clientInstance = null; // reset instance
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('feedo_supabase_url');
  localStorage.removeItem('feedo_supabase_key');
  clientInstance = null;
};

export const SQL_SCHEMA_DDL = `-- =========================================================
-- FEEDO RESTAURANT PARTNER APP — COMPLETE DATABASE SCHEMA
-- Free PostgreSQL 16 on Supabase / Neon
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESTAURANTS
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_name TEXT NOT NULL,
    owner_phone TEXT UNIQUE NOT NULL,
    owner_email TEXT UNIQUE NOT NULL,
    restaurant_name TEXT NOT NULL,
    restaurant_type TEXT NOT NULL,
    cuisines TEXT[] NOT NULL DEFAULT '{}',
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    pincode TEXT NOT NULL DEFAULT '560034',
    fssai_number TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    gst_number TEXT,
    bank_account TEXT NOT NULL,
    bank_ifsc TEXT NOT NULL,
    is_online BOOLEAN DEFAULT true,
    auto_accept_orders BOOLEAN DEFAULT false,
    new_order_sound BOOLEAN DEFAULT true,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    reg_status TEXT DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    image_url TEXT,
    is_veg BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    prep_time_minutes INT DEFAULT 15,
    is_bestseller BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'FD10245'
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone_masked TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 40,
    platform_fee NUMERIC(10, 2) DEFAULT 10,
    taxes NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'PAID',
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PAYMENT_CONFIRMED',
    special_instructions TEXT,
    rejection_reason TEXT,
    pickup_code TEXT NOT NULL DEFAULT '7284',
    prep_minutes INT DEFAULT 18,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- 4. ORDER LINE ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_veg BOOLEAN DEFAULT true
);

-- 5. SETTLEMENTS & PAYOUTS
CREATE TABLE IF NOT EXISTS public.settlements (
    id TEXT PRIMARY KEY,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    settlement_date DATE NOT NULL,
    gross_amount NUMERIC(10, 2) NOT NULL,
    commission_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL,
    net_payout NUMERIC(10, 2) NOT NULL,
    utr_reference TEXT,
    status TEXT DEFAULT 'SETTLED'
);

-- ENABLE SUPABASE REALTIME REPLICATION ON ORDERS
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- INSERT DEFAULT LUCKY FAMILY RESTAURANT
INSERT INTO public.restaurants (
    id, owner_name, owner_phone, owner_email, restaurant_name, restaurant_type,
    cuisines, address, fssai_number, pan_number, bank_account, bank_ifsc
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Lakshmi Narayana',
    '+91 98765 43210',
    'lucky.family.blr@feedopartner.com',
    'Lucky Family Restaurant',
    'Restaurant',
    ARRAY['Biryani', 'South Indian', 'North Indian', 'Chinese'],
    'No. 42, 80 Feet Road, 4th Block, Koramangala, Bengaluru',
    '21223004000891',
    'AABCL9921D',
    '5010023489921',
    'HDFC0000053'
) ON CONFLICT (owner_phone) DO NOTHING;
`;
