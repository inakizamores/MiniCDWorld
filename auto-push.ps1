# PowerShell script to automatically commit and push changes to GitHub
# Usage: .\auto-push.ps1 [commit message]

# Default commit message
$defaultMessage = "Auto-update: Changes made on $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# Get commit message from args or use default
$commitMessage = if ($args[0]) { $args[0] } else { $defaultMessage }

# Check if there are any changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected, proceeding with auto-push..."
    
    # Add all changes
    git add .
    
    # Commit changes with the provided or default message
    git commit -m "$commitMessage"
    
    # Push changes to the remote repository
    git push
    
    Write-Host "Successfully pushed changes to GitHub."
} else {
    Write-Host "No changes detected. Nothing to commit and push."
} 