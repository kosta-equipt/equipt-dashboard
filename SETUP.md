# Equipt Dashboard — Setup Guide

This dashboard is a Next.js app deployed on Vercel that pulls live data from a private Google Sheet. Before it shows real numbers, you need to do the one-time setup below.

Total time: **~15 minutes**. Budget: **£0** — everything used here is on free tiers.

---

## 1. Create a Google Cloud service account

A service account is a "robot user" that can read your sheet on behalf of the dashboard. It never logs in as you, and it can only see sheets you explicitly share with it.

1. Go to https://console.cloud.google.com/ and sign in with the Google account that owns the tracker sheet.
2. Top bar → **Select a project** → **New project**. Name it **Equipt Dashboard**. Click **Create**.
3. Wait a few seconds, then select the new project from the top bar.
4. Left menu → **APIs & Services** → **Library**. Search for **Google Sheets API**, click it, then click **Enable**.
5. Left menu → **APIs & Services** → **Credentials** → **Create Credentials** → **Service account**.
   - Service account name: `equipt-dashboard`
   - Click **Create and continue**, skip the optional role step, click **Done**.
6. On the Credentials screen, click the service account row that just appeared.
7. Tab **Keys** → **Add key** → **Create new key** → **JSON** → **Create**.
   A JSON file downloads to your computer. **Keep this file private — it is the robot's password.**

From the JSON file you'll need two values:

- `client_email` → looks like `equipt-dashboard@equipt-dashboard.iam.gserviceaccount.com`
- `private_key` → the long block starting with `-----BEGIN PRIVATE KEY-----`

---

## 2. Share the sheet with the service account

1. Open the Equipt Social Media Tracker sheet in Google Sheets.
2. Click **Share** (top right).
3. Paste the service account's `client_email` address.
4. Set permission to **Viewer**. Uncheck "Notify people".
5. Click **Share**.

---

## 3. Add environment variables in Vercel

1. Go to https://vercel.com/dashboard → open the **equipt-dashboard** project.
2. **Settings** → **Environment Variables**.
3. Add these three variables (scope: **Production, Preview, Development** for all three):

| Name | Value |
|------|-------|
| `SHEET_ID` | `1CY3LNWcjwbqignXrGKZ0m-gVWh9wU0PEuQO_ZBO91Vw` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | the `client_email` from the JSON |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | the `private_key` from the JSON — paste the whole thing, including the BEGIN/END lines |

> **Important:** when you paste the private key into Vercel, keep the `\n` escape sequences exactly as they appear in the JSON file. The app replaces them at runtime.

4. Click **Save** after each one.
5. Go to the **Deployments** tab → click the three-dot menu on the latest deployment → **Redeploy**. This picks up the new env vars.

---

## 4. Verify

1. Open https://equipt-dashboard.vercel.app/
2. You should see KPI numbers from the Command Centre tab and trend charts from the Performance tab.
3. Edit any cell in the sheet and click **Refresh** in the top-right of the dashboard — the new value should appear within a second or two.
4. If you leave the dashboard alone, it auto-refreshes from the sheet every 5 minutes.

---

## Running locally

```bash
cd equipt-dashboard
cp .env.example .env.local   # then fill in real values
npm install
npm run dev
```

Open http://localhost:3000

---

## Renaming or adding sheet tabs

The dashboard reads three tabs by name. If you rename them in Google Sheets, also update these env vars (defaults in brackets):

- `SHEET_TAB_COMMAND_CENTRE` *(EQUIPT — Command Centre)*
- `SHEET_TAB_PERFORMANCE` *(Performance)*
- `SHEET_TAB_CONTENT_CALENDAR` *(Content Calendar)*

To add a brand new widget from a new tab, see the "Extending" section in `CLAUDE.md`.

---

## Troubleshooting

**"Not connected" badge stays lit** → the three env vars are missing or the deployment hasn't been redeployed since you added them. Go to Vercel → Deployments → Redeploy.

**"The caller does not have permission"** → the sheet isn't shared with the service account email yet. Repeat step 2.

**"Unable to parse range"** → a sheet tab has been renamed and the env var override isn't set. See "Renaming or adding sheet tabs" above.

**KPI values show "—"** → the label in the sheet doesn't match what the adapter is looking for. The adapter scans for "Total Posts", "Total Reach", "Total Likes", "Avg Engagement", "Total Shares", "Total Saves" (case-insensitive). Tweak the labels in the sheet or ask Claude to update `lib/sheets/adapters.ts`.
