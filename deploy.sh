#!/usr/bin/env bash
# ── Deploy to Google Cloud Run ──────────────────────────────────────────
# Usage: ./deploy.sh [project-id] [region]
# Example: ./deploy.sh my-gcp-project us-central1
#
# Prerequisites:
#   gcloud auth login
#   gcloud auth configure-docker us-central1-docker.pkg.dev
#   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
#   gcloud secrets create gemini-api-key --replication-policy=automatic
#   echo -n "YOUR_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

set -euo pipefail

PROJECT_ID="${1:-$(gcloud config get-value project)}"
REGION="${2:-us-central1}"
SERVICE_NAME="dell-era-voice-chat"
REPO="dell-era-voice"
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/app"

echo "▶ Project : $PROJECT_ID"
echo "▶ Region  : $REGION"
echo "▶ Image   : $IMAGE_URL"
echo ""

# 1. Ensure Artifact Registry repo exists
gcloud artifacts repositories describe "$REPO" \
  --location="$REGION" \
  --project="$PROJECT_ID" 2>/dev/null || \
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --project="$PROJECT_ID"

# 2. Build image
echo "▶ Building Docker image..."
docker build -t "${IMAGE_URL}:latest" .

# 3. Push image
echo "▶ Pushing image..."
docker push "${IMAGE_URL}:latest"

# 4. Deploy to Cloud Run
echo "▶ Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image="${IMAGE_URL}:latest" \
  --region="$REGION" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest" \
  --project="$PROJECT_ID"

echo ""
echo "✓ Deployed. Service URL:"
gcloud run services describe "$SERVICE_NAME" \
  --region="$REGION" \
  --project="$PROJECT_ID" \
  --format="value(status.url)"
