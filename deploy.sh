#!/usr/bin/env bash
set -e

REMOTE="origin"
BRANCH="gh-pages"
OUT_DIR="out"

echo "▶ Building..."
NODE_ENV=production npm run build

echo "▶ Preparing $BRANCH branch..."

# Add .nojekyll so GitHub Pages doesn't ignore _next/
touch "$OUT_DIR/.nojekyll"

# If gh-pages branch doesn't exist on remote yet, create an empty one
if ! git ls-remote --exit-code "$REMOTE" "$BRANCH" > /dev/null 2>&1; then
  echo "  Creating $BRANCH branch..."
  git checkout --orphan "$BRANCH" 2>/dev/null || true
  git rm -rf . --quiet 2>/dev/null || true
  git commit --allow-empty -m "init gh-pages"
  git push "$REMOTE" "$BRANCH"
  git checkout main
fi

# Use a worktree so we never leave the main branch
WORKTREE_DIR=$(mktemp -d)
git worktree add "$WORKTREE_DIR" "$BRANCH" 2>/dev/null || {
  # worktree may already exist from a failed run
  git worktree remove --force "$WORKTREE_DIR" 2>/dev/null || true
  git worktree add "$WORKTREE_DIR" "$BRANCH"
}

echo "▶ Copying build output..."
# Clear old content, keep .git
find "$WORKTREE_DIR" -mindepth 1 -not -path '*/.git*' -delete
cp -r "$OUT_DIR"/. "$WORKTREE_DIR/"

echo "▶ Committing..."
cd "$WORKTREE_DIR"
git add -A
COMMIT_MSG="deploy: $(date '+%Y-%m-%d %H:%M:%S') — $(git -C "$OLDPWD" rev-parse --short HEAD)"
git commit -m "$COMMIT_MSG" --allow-empty
git push "$REMOTE" "$BRANCH"

cd "$OLDPWD"
git worktree remove --force "$WORKTREE_DIR"

echo ""
echo "✓ Deployed to $BRANCH"
echo "  Live at: $(git remote get-url $REMOTE | sed 's/\.git$//' | sed 's|https://github.tools.sap/|https://pages.github.tools.sap/|')"
