# 🚀 Launch Guide: findhalalonly.com

Congratulations on securing your domain! Here are the steps to get **Find Halal** live on the internet.

## Phase 0: Database Clean Slate
Before launching, you should remove the test data (fake reviews) used during development.

1.  Go to your **Supabase Dashboard > SQL Editor**.
2.  Run the following command to delete all test reviews while keeping your restaurant data:
    ```sql
    DELETE FROM reviews;
    ```
    *(Note: This ensures your app starts with 0 reviews so your real community can fill it up!)*

## Phase 1: Deploy to Vercel
1. **GitHub**: If not already done, create a new repository on GitHub and push your code.
2. **Connect**: Log in to [Vercel](https://vercel.com/) and click **Add New > Project**. Select your GitHub repo.
3. **Environment Variables**: During setup, manually copy every variable from your `.env.local` to Vercel's "Environment Variables" section:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. **Deploy**: Click the "Deploy" button. You will get a temporary URL (e.g., `find-halal.vercel.app`).

## Phase 2: Connect findhalalonly.com (GoDaddy)
1. **In Vercel**: 
   - Go to your Project > **Settings > Domains**.
   - Type in `findhalalonly.com` and click **Add**.
   - Vercel will show you the **DNS Records** you need.
2. **In GoDaddy**:
   - Log in and go to your **Domain Portfolio > DNS Management** for `findhalalonly.com`.
   - **Add A Record**: Set Name to `@` and Value to the IP provided by Vercel (usually `76.76.21.21`).
   - **Add CNAME Record**: Set Name to `www` and Value to `cname.vercel-dns.com`.
3. **Wait**: It may take 10-60 minutes for the domain to "propagate" (start working).

## Phase 3: Update Integrations (CRITICAL)
Your app won't allow logins or show maps until you whitelist the new domain.

### 1. Supabase (Login Fix)
- Go to [Supabase Dashboard](https://supabase.com/) > **Authentication > URL Configuration**.
- **Site URL**: Change to `https://findhalalonly.com`.
- **Redirect URLs**: Add `https://findhalalonly.com/**`.

### 2. Google Maps (Visuals Fix)
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Select your project > **APIs & Services > Credentials**.
- Edit your API Key.
- Under **Website restrictions**, add:
  - `findhalalonly.com/*`
  - `*.findhalalonly.com/*`

---
> [!IMPORTANT]
> Always test your login and search once the domain is live to ensure the redirects are working correctly!
