# Quick Start Guide 🚀

## Step 1: Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL**
   - **anon public** key

## Step 2: Create `.env` File

In the `webversion` folder, create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Enable Row Level Security

1. Go to Supabase dashboard → **SQL Editor**
2. Copy content from `supabase_rls_policies.sql`
3. Paste and click **Run**

## Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure settings as needed

## Step 5: Start the App

```bash
cd webversion
npm run dev
```

Open http://localhost:5173

## Step 6: Test

1. Visit `/register` to create an account
2. Login at `/login`
3. Access protected routes like `/profile`

That's it! 🎉

---

**Full documentation:** See `SETUP_INSTRUCTIONS.md`

