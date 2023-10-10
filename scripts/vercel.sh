#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "production" ]] ; then
  echo "✅ - Build permitted"
  exit 1;
else
  echo "🛑 - Build not permitted"
  exit 0;
fi