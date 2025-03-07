# Automatic GitHub Push Options

This project includes several methods for automatically pushing changes to GitHub. Choose the option that best fits your workflow.

## Option 1: Manual Script Execution

Two scripts are provided for manually triggering pushes:

### Windows PowerShell Script

```
.\auto-push.ps1 [custom commit message]
```

### Bash Script (for Git Bash, WSL, or Unix-like systems)

```
./auto-push.sh [custom commit message]
```

Both scripts will:
1. Check if there are any changes to commit
2. Add all changes to the staging area
3. Commit with either the provided message or a default timestamped message
4. Push changes to the remote repository

## Option 2: Git Post-Commit Hook

For automatic pushing after every commit, you can set up a post-commit hook:

```
.\setup-auto-push.ps1
```

This will configure Git to automatically push after each commit, eliminating the need to manually run `git push`.

## Option 3: GitHub Actions Workflow

For more advanced automation, this project includes a GitHub Actions workflow in `.github/workflows/auto-push.yml` that can:

- Push changes when triggered manually from GitHub
- Automatically commit and push any changes detected on the repository

To enable scheduled pushing, uncomment the schedule section in the workflow file.

## Authentication Notes

- When pushing from your local machine, you'll need to authenticate with GitHub
- For Windows, consider using the Git Credential Manager
- For more secure access, set up SSH keys with GitHub

## Troubleshooting

If you encounter issues with automatic pushing:

1. Check that your repository is correctly connected to GitHub with:
   ```
   git remote -v
   ```

2. Ensure you have the correct permissions to push to the repository

3. For GitHub Actions issues, check the Actions tab in your GitHub repository 