#!/bin/bash

echo "✅ Importing workflows and credentials..."

# Import workflow(s)
for wf in /workflows/*.json; do
  if [ -f "$wf" ]; then
    echo "📥 Importing workflow: $wf"
    n8n import:workflow --input "$wf"
  fi
done

# Import credential(s)
for cred in /credentials/*.json; do
  if [ -f "$cred" ]; then
    echo "📥 Importing credential: $cred"
    n8n import:credentials --input "$cred"
  fi
done

echo "🚀 Starting n8n..."
n8n start
