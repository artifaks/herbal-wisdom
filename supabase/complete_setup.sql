-- Drop existing objects if they exist
DROP FUNCTION IF EXISTS public.set_user_as_admin(TEXT);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin(UUID);
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TABLE IF EXISTS public.user_roles;
DROP TYPE IF EXISTS public.user_role;

-- Create the user_role enum
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create the user_roles table
CREATE TABLE public.user_roles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role user_role DEFAULT 'user'::user_role,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = id);

-- Function to check if a user is an admin
CREATE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE id = user_id
        AND role = 'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically add role for new users
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (id, role)
    VALUES (NEW.id, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Function to set a user as admin
CREATE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_roles (id, role)
    SELECT id, 'admin'
    FROM auth.users
    WHERE email = user_email
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add existing users to user_roles table
INSERT INTO public.user_roles (id, role)
SELECT id, 'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_roles)
ON CONFLICT (id) DO NOTHING;
