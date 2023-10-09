#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "indev" ]] ; then
  echo "🛑 - Build not permitted"
  exit 0;
else
  echo "✅ - Build permitted"
  exit 1;
fi