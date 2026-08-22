#!/bin/bash
cd "$(dirname "$0")"
export PATH="$PWD/.node-runtime/bin:$PATH"
exec npm run dev
