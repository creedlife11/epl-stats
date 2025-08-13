# Deployment Guide

## Environment Variables

Your app requires the following environment variable to work properly:

```
FOOTBALL_DATA_TOKEN=4dd701d8f7204ebab9bbda41e5479a9f
```

## Vercel Deployment

1. **Push your code to GitHub** (the .env.local file is already in .gitignore)

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `FOOTBALL_DATA_TOKEN` = `4dd701d8f7204ebab9bbda41e5479a9f`
   - Make sure it's available for all environments (Production, Preview, Development)

3. **Redeploy** your application

## Other Hosting Platforms

### Netlify
- Go to Site Settings → Environment Variables
- Add: `FOOTBALL_DATA_TOKEN` = `4dd701d8f7204ebab9bbda41e5479a9f`

### Railway/Render
- In your project dashboard, go to Environment Variables
- Add: `FOOTBALL_DATA_TOKEN` = `4dd701d8f7204ebab9bbda41e5479a9f`

## API Information

- **Provider**: football-data.org
- **Tier**: Free (10 requests/minute)
- **Current Status**: ✅ Working
- **Season**: 2024-25 (just started, limited data available)

## Notes

- The API currently shows 0 goals/points because the 2024-25 season just started
- Team data, crests, and squad information are fully available
- Stats pages will populate as the season progresses