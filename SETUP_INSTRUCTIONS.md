# TTRPG App - Setup Instructions

Congratulations! Your Supabase database schema is set up. Follow these steps to complete the integration.

## 📋 What We've Done

✅ Installed Supabase client library  
✅ Created Supabase configuration  
✅ Built authentication system with AuthContext  
✅ Implemented comprehensive API service layer  
✅ Updated Login/Register pages  
✅ Created protected route system  
✅ Generated RLS (Row Level Security) policies  

## 🚀 Next Steps

### 1. Configure Environment Variables

You need to create a `.env` file in the `webversion` folder with your Supabase credentials:

```bash
cd webversion
```

Create a `.env` file with the following content:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Where to find these values:**
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon) in the left sidebar
3. Click on "API"
4. Copy the **Project URL** → paste as `VITE_SUPABASE_URL`
5. Copy the **anon public** key → paste as `VITE_SUPABASE_ANON_KEY`

### 2. Set Up Row Level Security (RLS)

RLS ensures users can only access their own data. Run the RLS policies:

1. Open your Supabase project dashboard
2. Go to "SQL Editor" in the left sidebar
3. Open the file `supabase_rls_policies.sql` (in the project root)
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click "Run" to execute

### 3. Configure Supabase Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email settings:
   - **Confirm email**: Enable if you want users to verify their email
   - **Secure email change**: Recommended
   - **Enable email confirmations**: Recommended for production

### 4. (Optional) Seed Initial Data

If you want to add some sample spells, items, or abilities for testing:

1. Open `seed_data.sql` in the project root
2. Copy the SQL code
3. Paste it into Supabase SQL Editor
4. Run the script

### 5. Start the Development Server

```bash
cd webversion
npm run dev
```

The app should now be running at `http://localhost:5173`

## 🧪 Testing Authentication

1. **Register a new account:**
   - Go to `http://localhost:5173/register`
   - Enter email, username, and password
   - Submit the form

2. **Check your email:**
   - If email confirmation is enabled, check your inbox
   - Click the confirmation link

3. **Login:**
   - Go to `http://localhost:5173/login`
   - Enter your email and password
   - You should be redirected to the home page

4. **Test protected routes:**
   - Try accessing `/profile`, `/notes`, etc.
   - You should have access when logged in
   - If you log out, you'll be redirected to login

## 📁 Key Files Created

### Configuration
- `webversion/src/config/supabase.ts` - Supabase client initialization

### Authentication
- `webversion/src/contexts/AuthContext.tsx` - Authentication state management
- `webversion/src/components/ProtectedRoute.tsx` - Route protection wrapper

### API Services
- `webversion/src/services/api.ts` - Complete API layer with methods for:
  - Users
  - Characters & Attributes
  - Skills & Proficiencies
  - Notes
  - Spells & Abilities
  - Attacks
  - Items & Inventory
  - Groups & Storage
  - Games & Sessions

### Updated Pages
- `webversion/src/pages/auth/login/login.tsx` - Login with Supabase
- `webversion/src/pages/auth/register/register.tsx` - Registration with Supabase
- `webversion/src/App.tsx` - Wrapped with AuthProvider and ProtectedRoute

## 🔧 API Usage Examples

### Get Current User's Characters
```typescript
import { characterApi } from './services/api';
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      const fetchCharacters = async () => {
        const characters = await characterApi.getCharactersByUserId(user.id);
        console.log(characters);
      };
      fetchCharacters();
    }
  }, [user]);
}
```

### Create a New Character
```typescript
const newCharacter = await characterApi.createCharacter({
  user_id: user.id,
  name: "Aragorn",
  race: "Human",
  class: "Ranger",
  origin: "North",
  size: "Medium",
  level: 1,
  current_health: 30,
  max_health: 30,
  current_mana: 10,
  max_mana: 10,
});
```

### Add Item to Character Inventory
```typescript
await itemsApi.addItemToCharacter(characterId, itemId, quantity);
```

### Get Character Spells
```typescript
const spells = await spellsApi.getCharacterSpells(characterId);
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use RLS policies** - Already configured in `supabase_rls_policies.sql`
3. **Validate on the server** - Supabase RLS handles this
4. **Never expose service role key** - Only use the anon public key

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in `webversion/` folder
- Make sure variables start with `VITE_` prefix
- Restart the dev server after creating `.env`

### "Invalid login credentials"
- Make sure you've confirmed your email (if required)
- Check that the user exists in Supabase Auth dashboard
- Verify email/password are correct

### "Row Level Security policy violation"
- Make sure you ran `supabase_rls_policies.sql`
- Check that policies are enabled in Supabase dashboard
- Verify you're logged in with the correct user

### TypeScript errors
- Run `cd webversion && npm install` to ensure all dependencies are installed
- Check that `@supabase/supabase-js` is in `package.json`

## 📚 Next Development Steps

1. **Create Character Context** - Manage active character state
2. **Build Character Selection Screen** - Let users choose which character to play
3. **Connect existing components** - Use the API layer to fetch/update data
4. **Add real-time features** - Use Supabase Realtime for live updates in games
5. **Implement file uploads** - For character images (use Supabase Storage)

## 🎮 Database Structure

Your database includes tables for:
- **Users** - User accounts and preferences
- **Characters** - Player characters with stats
- **Skills & Proficiencies** - Character abilities
- **Spells & Abilities** - Magic and powers
- **Attacks** - Combat actions
- **Items & Equipment** - Inventory system
- **Groups** - Party management
- **Games & Sessions** - Campaign tracking
- **Notes** - In-game note-taking

All tables have proper relationships, indexes, and RLS policies configured!

## 💡 Tips

- Use the `useAuth()` hook to access current user anywhere
- All API methods throw errors - wrap in try/catch
- Character creation automatically creates default attributes
- Items, spells, and abilities are shared across all users (read-only)
- Currency is tracked at both character and group level

---

**Need help?** Check the code comments in each file for detailed documentation.

**Happy adventuring!** 🎲✨

