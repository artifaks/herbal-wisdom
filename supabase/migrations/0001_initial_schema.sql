-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due');
CREATE TYPE store_status AS ENUM ('active', 'pending', 'inactive');

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_status subscription_status DEFAULT 'active',
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Herbs table
CREATE TABLE IF NOT EXISTS herbs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    scientific_name TEXT,
    description TEXT,
    benefits TEXT[],
    usage_instructions TEXT,
    precautions TEXT,
    categories TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Herbal stores table
CREATE TABLE IF NOT EXISTS herbal_stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    status store_status DEFAULT 'active',
    rating DECIMAL CHECK (rating >= 0 AND rating <= 5),
    operating_hours JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    herb_id UUID REFERENCES herbs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, herb_id)
);

-- Store reviews table
CREATE TABLE IF NOT EXISTS store_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID REFERENCES herbal_stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription history table
CREATE TABLE IF NOT EXISTS subscription_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT NOT NULL,
    status subscription_status NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS herbs_name_idx ON herbs(name);
CREATE INDEX IF NOT EXISTS herbs_categories_idx ON herbs USING GIN(categories);
CREATE INDEX IF NOT EXISTS stores_location_idx ON herbal_stores(city, state, country);
CREATE INDEX IF NOT EXISTS stores_coordinates_idx ON herbal_stores(latitude, longitude);

-- Row Level Security Policies
-- Profiles: Users can only read their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Herbs: Anyone can read, only admins can modify
CREATE POLICY "Anyone can view herbs"
    ON herbs FOR SELECT
    TO PUBLIC
    USING (true);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Users can manage their favorites"
    ON user_favorites FOR ALL
    USING (auth.uid() = user_id);

-- Store reviews: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view store reviews"
    ON store_reviews FOR SELECT
    TO PUBLIC
    USING (true);

CREATE POLICY "Authenticated users can create reviews"
    ON store_reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE herbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE herbal_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_herbs_updated_at
    BEFORE UPDATE ON herbs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_herbal_stores_updated_at
    BEFORE UPDATE ON herbal_stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_reviews_updated_at
    BEFORE UPDATE ON store_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for handling new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
