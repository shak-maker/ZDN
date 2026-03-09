#!/bin/bash
# Push ZDN to GitHub using the server's deploy key.
# Run this on the server (e.g. in SSH) after adding the public key to your GitHub account.

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY="$REPO_ROOT/.ssh-deploy/id_ed25519"
KNOWN_HOSTS="$REPO_ROOT/.ssh-deploy/known_hosts"

# Ensure GitHub is in known_hosts
if ! grep -q github.com "$KNOWN_HOSTS" 2>/dev/null; then
  ssh-keyscan -t ed25519 github.com >> "$KNOWN_HOSTS" 2>/dev/null || true
fi

export GIT_SSH_COMMAND="ssh -i $KEY -o UserKnownHostsFile=$KNOWN_HOSTS -o StrictHostKeyChecking=accept-new"
cd "$REPO_ROOT"
git push git@github.com:shak-maker/ZDN.git main

echo "Push to GitHub completed."
