# Troubleshooting Guide: Admin Panel 404 & Access Issues

## 1. Backend Status
**Status:** ✅ Fixed & Running
**Port:** 5000
**Database:** Local (`127.0.0.1:27017`)
**Auth Middleware:** ✅ Updated to handle empty database/invalid tokens gracefully (returns 401 instead of crashing).

## 2. Admin Panel Status
**Status:** ✅ Running
**Expected Port:** Likely `3001` (since `3000` is usually the Storefront).
**Login URL:** `/login`

## 3. Why you are seeing "404 Not Found"
You are likely accessing the **wrong application** or **wrong port**.

### Scenario A: Accessing the Storefront by mistake
*   The **Storefront** (Skincare Store) typically runs on `http://localhost:3000`.
*   It **does NOT** have a page at `/login`. Its login page is at `/account/login`.
*   If you visit `http://localhost:3000/login`, you will get a **404**.

### Scenario B: Admin Panel Port
*   The **Admin Panel** is a separate app. If you started it *after* the storefront, it is likely on `http://localhost:3001` (or check your terminal output).
*   The Admin Panel **DOES** have a page at `/login`.
*   **Action:** Try visiting `http://localhost:3001/login` or `http://localhost:3002/login`.

## 4. Immediate Steps
1.  **Check Terminal:** Look at the terminal running `admin-pannel`. It will say `Ready on http://localhost:XXXX`. Use that port.
2.  **Seed Database:** Since we switched to a new local database, you need to create the admin user:
    ```bash
    cd backend
    npm run seed
    ```
    (Credentials: `admin@luminelle.com` / `admin123`)
3.  **Clear Browser Cache:** Old redirects might be cached. Open Incognito/Private window to test.
