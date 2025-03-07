# PowerShell script to set up automatic Git pushes via post-commit hook
# Usage: .\setup-auto-push.ps1

# Path to the Git hooks directory
$hooksDir = ".\.git\hooks"

# Create post-commit hook
$hookPath = "$hooksDir\post-commit"

# Create the hook content
$hookContent = @"
#!/bin/sh
# Post-commit hook to automatically push changes after each commit

# Get the current branch name
BRANCH=\$(git symbolic-ref --short HEAD)

echo "Auto-pushing changes to \$BRANCH..."
git push origin \$BRANCH

# Check if push was successful
if [ \$? -eq 0 ]; then
    echo "Auto-push successful!"
else
    echo "Auto-push failed. You'll need to push manually."
fi
"@

# Windows-specific post-commit.cmd file for ease of use
$winHookPath = "$hooksDir\post-commit.cmd"
$winHookContent = @"
@echo off
echo Auto-pushing changes after commit...
git push
if %errorlevel% equ 0 (
    echo Auto-push successful!
) else (
    echo Auto-push failed. You'll need to push manually.
)
"@

# Ensure hooks directory exists
if (-not (Test-Path $hooksDir)) {
    Write-Host "Creating hooks directory..."
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

# Write the hook files
Set-Content -Path $hookPath -Value $hookContent -Encoding ASCII
Set-Content -Path $winHookPath -Value $winHookContent -Encoding ASCII

# Make the hook executable (for Unix-like systems)
Write-Host "Setting up post-commit hooks..."

# For Windows, we need to ensure git knows the file is executable
git config core.fileMode true
git update-index --chmod=+x "$hookPath"
git update-index --chmod=+x "$winHookPath"

Write-Host "Auto-push setup complete! Now your changes will be automatically pushed after each commit."
Write-Host "Note: If you're prompted for credentials, consider setting up credential caching or SSH keys." 