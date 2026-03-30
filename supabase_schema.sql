-- Run this in your Supabase SQL Editor

-- Table for Intentions
-- ⚠️ O campo "value" é armazenado criptografado (AES-256-GCM).
-- A criptografia/decriptação é feita pelas API Routes do Next.js (server-side).
-- No painel do Supabase os valores aparecem no formato: iv:ciphertext:authTag (hex).
CREATE TABLE IF NOT EXISTS intentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phase_id text NOT NULL,
  value text NOT NULL,  -- Encrypted with AES-256-GCM
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, phase_id)
);

-- RLS for intentions
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own intentions" 
ON intentions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own intentions" 
ON intentions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own intentions" 
ON intentions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intentions" 
ON intentions FOR DELETE 
USING (auth.uid() = user_id);

-- Table for Calendar Activities (Tasks)
-- ⚠️ O campo "text" é armazenado criptografado (AES-256-GCM).
-- A criptografia/decriptação é feita pelas API Routes do Next.js (server-side).
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date_str text NOT NULL,
  text text NOT NULL,  -- Encrypted with AES-256-GCM
  done boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS for activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own activities" 
ON activities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activities" 
ON activities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
ON activities FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
ON activities FOR DELETE 
USING (auth.uid() = user_id);
