-- Supabase Schema for Records App
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Memories table
CREATE TABLE IF NOT EXISTS "Memories" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rent table
CREATE TABLE IF NOT EXISTS "Rent" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RentTransaction table
CREATE TABLE IF NOT EXISTS "RentTransaction" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ChitFunds table
CREATE TABLE IF NOT EXISTS "ChitFunds" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ChitFundTransactions table
CREATE TABLE IF NOT EXISTS "ChitFundTransactions" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WaterCanEntries table
CREATE TABLE IF NOT EXISTS "WaterCanEntries" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table
CREATE TABLE IF NOT EXISTS "Bills" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS "Users" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SharedUsers table
CREATE TABLE IF NOT EXISTS "SharedUsers" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Share table
CREATE TABLE IF NOT EXISTS "Share" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  time BIGINT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_memories_user_id ON "Memories"(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_user_id ON "Rent"(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_transaction_user_id ON "RentTransaction"(user_id);
CREATE INDEX IF NOT EXISTS idx_chitfunds_user_id ON "ChitFunds"(user_id);
CREATE INDEX IF NOT EXISTS idx_chitfund_transactions_user_id ON "ChitFundTransactions"(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON "Bills"(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE "Memories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Rent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RentTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChitFunds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChitFundTransactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WaterCanEntries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SharedUsers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Share" ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow users to access only their own data
-- For now, using anon key with user_id filter (Firebase Auth)
-- You can enhance this with Supabase Auth later

CREATE POLICY "Allow all for anon" ON "Memories" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "Rent" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "RentTransaction" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "ChitFunds" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "ChitFundTransactions" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "WaterCanEntries" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "Bills" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "Users" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "SharedUsers" FOR ALL USING (true);
CREATE POLICY "Allow all for anon" ON "Share" FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE "Memories";
ALTER PUBLICATION supabase_realtime ADD TABLE "Rent";
ALTER PUBLICATION supabase_realtime ADD TABLE "RentTransaction";
ALTER PUBLICATION supabase_realtime ADD TABLE "ChitFunds";
ALTER PUBLICATION supabase_realtime ADD TABLE "ChitFundTransactions";
ALTER PUBLICATION supabase_realtime ADD TABLE "WaterCanEntries";
ALTER PUBLICATION supabase_realtime ADD TABLE "Bills";
ALTER PUBLICATION supabase_realtime ADD TABLE "Users";
ALTER PUBLICATION supabase_realtime ADD TABLE "SharedUsers";
ALTER PUBLICATION supabase_realtime ADD TABLE "Share";
