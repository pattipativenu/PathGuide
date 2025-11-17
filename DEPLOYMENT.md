# PathGuide Deployment Guide

## Environment Variables

This application requires the following environment variables to be set:

### Required Variables

- `OPENAI_API_KEY`: Your OpenAI API key
  - Get it from: https://platform.openai.com/api-keys
  - Format: `sk-...`

## Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Google Cloud Run)

### Option 1: Using gcloud CLI

1. Build and deploy:
   ```bash
   gcloud run deploy pathguide \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OPENAI_API_KEY=your_actual_api_key_here
   ```

### Option 2: Using Google Cloud Console

1. Go to Google Cloud Run console
2. Create new service or select existing
3. Deploy from source (connect to your Bitbucket repository)
4. In "Variables & Secrets" section, add:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
5. Deploy

### Option 3: Using Secret Manager (Recommended for Production)

1. Create secret in Google Secret Manager:
   ```bash
   echo -n "your_actual_api_key_here" | gcloud secrets create openai-api-key --data-file=-
   ```

2. Grant Cloud Run access to the secret:
   ```bash
   gcloud secrets add-iam-policy-binding openai-api-key \
     --member=serviceAccount:YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com \
     --role=roles/secretmanager.secretAccessor
   ```

3. Deploy with secret reference:
   ```bash
   gcloud run deploy pathguide \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-secrets OPENAI_API_KEY=openai-api-key:latest
   ```

## Security Best Practices

✅ **DO:**
- Store API keys in environment variables
- Use `.env` for local development
- Add `.env` to `.gitignore`
- Use Google Secret Manager for production
- Rotate API keys regularly

❌ **DON'T:**
- Commit `.env` files to version control
- Hardcode API keys in source code
- Share API keys in chat/email
- Use the same key for dev and production

## Verifying Deployment

After deployment, verify the application is working:

1. Visit your Cloud Run URL
2. Create a roadmap
3. Check browser console for any API errors
4. Test quiz generation
5. Test university search

## Troubleshooting

### "OpenAI API key not found" error
- Verify environment variable is set in Cloud Run
- Check variable name is exactly `OPENAI_API_KEY`
- Ensure no extra spaces in the key value

### "Invalid API key" error
- Verify the API key is correct
- Check if the key has been revoked
- Ensure billing is enabled on OpenAI account

### Application not loading
- Check Cloud Run logs: `gcloud run logs read --service pathguide`
- Verify build completed successfully
- Check for any deployment errors

## Monitoring

Monitor your deployment:
- Cloud Run metrics: https://console.cloud.google.com/run
- OpenAI usage: https://platform.openai.com/usage
- Application logs: `gcloud run logs tail --service pathguide`

## Cost Optimization

- Set Cloud Run min instances to 0 (scale to zero when idle)
- Monitor OpenAI API usage
- Set up billing alerts
- Use caching where appropriate
