#!/bin/bash

# Setup script to enable Kiro-style specification hooks

echo "🔧 Setting up Kiro-style git hooks..."
echo "===================================="

# Create .githooks directory if it doesn't exist
mkdir -p .githooks

# Configure git to use our hooks directory
git config core.hooksPath .githooks

if [ $? -eq 0 ]; then
    echo "✅ Git hooks configured successfully"
    echo ""
    echo "Enabled hooks:"
    echo "  • pre-commit: Checks specification sync before commits"
    echo ""
    echo "The pre-commit hook will:"
    echo "  1. Verify all core spec files exist"
    echo "  2. Check that requirements have tasks"
    echo "  3. Warn about missing design references"
    echo "  4. Show task completion status"
    echo ""
    echo "To bypass hooks temporarily: git commit --no-verify"
else
    echo "❌ Failed to configure git hooks"
    exit 1
fi

echo ""
echo "Running initial spec sync check..."
echo "-----------------------------------"
./scripts/check-spec-sync.sh

echo ""
echo "✨ Setup complete! Your repository now follows Kiro-style spec-driven development."