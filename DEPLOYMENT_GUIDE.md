# 🚀 Rakhi 2026 Production Deployment Guide
**Domains**: `rakhi.jaswanthganta.tech` & `cloud.jaswanthganta.tech`  
**Cloudflare Managed Zone**: `jaswanthganta.tech`

---

## 📋 Overview of Setup

| Purpose | Domain / Route | Target Destination |
| :--- | :--- | :--- |
| **Public Experience** | `https://rakhi.jaswanthganta.tech/` | Serves Rakhi 2026 Sister Experience |
| **Admin Portal** | `https://rakhi.jaswanthganta.tech/admin` | Serves Admin Control Suite (PIN: `233014`) |
| **Server / Backend API** | `https://cloud.jaswanthganta.tech` | Server API & Database Proxy |

---

## 🛠️ Step 1: Deploying to Vercel (Recommended - Free Tier)

Vercel is the official zero-config deployment platform for Next.js 15.

1. Push your repository to **GitHub / GitLab**.
2. Go to [https://vercel.com/new](https://vercel.com/new) and import your repository.
3. In **Environment Variables**, add the following 5 variables:

```env
DATABASE_URL=postgresql://neondb_owner:npg_h9TcNoFqz1Hx@ep-dark-boat-azze5mws-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
GEMINI_API_KEY=AIzaSyBMOShjmwvQD-NSyAhTaaaD_Zhq2zUaENY
ADMIN_PIN=233014
JWT_SECRET=rakhi-2026-super-secret-jwt-key-for-admin-session-987654321
NEXT_PUBLIC_APP_URL=https://rakhi.jaswanthganta.tech
```

4. Click **Deploy**.
5. Once deployed, go to **Project Settings ➔ Domains**:
   - Add domain: `rakhi.jaswanthganta.tech`

---

## 🌐 Step 2: Cloudflare DNS Setup (`jaswanthganta.tech`)

Log in to your **Cloudflare Dashboard**, select `jaswanthganta.tech` ➔ **DNS ➔ Records**:

### A. For `rakhi.jaswanthganta.tech` (Public & Admin Site)
- **Type**: `CNAME`
- **Name**: `rakhi`
- **Target**: `cname.vercel-dns.com`
- **Proxy Status**: `Proxied (Orange Cloud 🟧)` or `DNS Only (Grey Cloud ⬛)`
- **TTL**: `Auto`

### B. For `cloud.jaswanthganta.tech` (Server)
- **Type**: `CNAME` (or `A` record pointing to your server IP / Cloudflare Tunnel)
- **Name**: `cloud`
- **Target**: `cname.vercel-dns.com` (or your VPS IP / tunnel endpoint)
- **Proxy Status**: `Proxied (Orange Cloud 🟧)`

---

## ⚙️ Step 3: Cloudflare SSL/TLS Settings
1. Go to **Cloudflare Dashboard ➔ SSL/TLS**.
2. Set Encryption Mode to **Full (Strict)**.
3. Enable **Always Use HTTPS** under **Edge Certificates**.

---

## 🎯 How URL Routing Works

Thanks to the updated `next.config.ts`:
- Visiting `https://rakhi.jaswanthganta.tech/` automatically routes sisters directly to their secret code unlock screen.
- Visiting `https://rakhi.jaswanthganta.tech/admin` opens the Admin Control Suite where you enter PIN `233014`.

---

## 🗄️ Database Auto-Migration Command (Build Command)
In Vercel **Build & Development Settings**, set the Build Command to:
```bash
npx prisma generate && npx prisma db push && next build
```
This ensures your Neon PostgreSQL database schema is automatically updated on every deployment!
