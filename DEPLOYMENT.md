# 🚀 Step-by-Step Launch: findhalalonly.com

Follow these exact steps to get your website live.

## Step 1: Create a GitHub Repository
1.  Go to [GitHub.com](https://github.com/) and Log in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name it: `find-halal`.
4.  Keep it **Public** (recommended for Vercel Free).
5.  Click **Create repository**.
6.  You will see a page with code. Look for the "Quick setup" URL:  
    `https://github.com/YOUR_USERNAME/find-halal.git` (Keep this handy).

## Step 2: Push Your Code to GitHub
Open your terminal in `d:/PROJECT- FIND HALAL/find-halal` and run these commands one at a time:
```bash
# 1. Connect your local code to your new GitHub Repo
git remote add origin https://github.com/YOUR_USERNAME/find-halal.git

# 2. Rename the main branch
git branch -M main

# 3. Upload everything!
git push -u origin main
```

## Step 3: Connect to Vercel
1.  Go to [Vercel.com](https://vercel.com/) and Log in with GitHub.
2.  Click **"Add New" > "Project"**.
3.  Find your `find-halal` repo and click **Import**.
4.  **Crucial: Environment Variables**
    Look for the "Environment Variables" section and add these three:
    - **Key**: `NEXT_PUBLIC_SUPABASE_URL` | **Value**: (Copy from your `.env.local`)
    - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Value**: (Copy from your `.env.local`)
    - **Key**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **Value**: (Copy from your `.env.local`)
5.  Click **Deploy**.

## Step 4: Connect findhalalonly.com
1.  In Vercel, go to your Project > **Settings > Domains**.
2.  Add `findhalalonly.com`.
3.  Vercel will show "Invalid Configuration" because we need to update GoDaddy.
4.  **Log in to GoDaddy** > DNS Management:
    - **A Record**: Name: `@` | Value: `76.76.21.21`
    - **CNAME Record**: Name: `www` | Value: `cname.vercel-dns.com`
5.  Wait about 30 minutes, and the domain will turn green in Vercel.

## Step 5: Whitelist Your Domain (VITAL)
Your site won't let people log in until you tell Supabase the new domain is safe.

1.  **Supabase**: Go to Authentication > **URL Configuration**.
    - Set **Site URL** to `https://findhalalonly.com`
    - In **Redirect URLs**, add: `https://findhalalonly.com/**`
2.  **Google Maps**: Go to Google Cloud Console > APIs & Services > Credentials.
    - Edit your API Key.
    - Under **Website restrictions**, add `*.findhalalonly.com/*`
3.  **Troubleshooting "This page can't load Google Maps correctly"**:
    - If you see this error, open your browser Console (F12).
    - If it says `BillingNotEnabledMapError`, go to [Google Cloud Billing](https://console.cloud.google.com/billing) and link a credit card to your project. Google requires this even for free usage.

---
> [!IMPORTANT]
> Once everything is done, your site will be live at **https://findhalalonly.com**!
