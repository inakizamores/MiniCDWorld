#!/bin/bash
# Bash script to automatically commit and push changes to GitHub
# Usage: ./auto-push.sh [commit message]

# Default commit message
DEFAULT_MESSAGE="Auto-update: Changes made on $(date '+%Y-%m-%d %H:%M')"

# Get commit message from args or use default
COMMIT_MESSAGE=${1:-$DEFAULT_MESSAGE}

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected, proceeding with auto-push..."
    
    # Add all changes
    git add .
    
    # Commit changes with the provided or default message
    git commit -m "$COMMIT_MESSAGE"
    
    # Push changes to the remote repository
    git push
    
    echo "Successfully pushed changes to GitHub."
else
    echo "No changes detected. Nothing to commit and push."
fi 