#!/bin/bash
# Fix broken emoji rendering in Kiro files

echo "Choose emoji style:"
echo "1. Unicode emojis (⬜ 🟨 ✅ ❌ 🔄)"
echo "2. ASCII alternatives ([ ] [~] [x] [!] [<>])"
echo "3. Text alternatives ([TODO] [WIP] [DONE] [BLOCKED] [REVIEW])"
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    # Keep Unicode emojis
    echo "Keeping Unicode emojis"
    ;;
  2)
    # Replace with ASCII
    sed -i.bak 's/⬜/[ ]/g' tasks.md
    sed -i.bak 's/🟨/[~]/g' tasks.md
    sed -i.bak 's/✅/[x]/g' tasks.md
    sed -i.bak 's/❌/[!]/g' tasks.md
    sed -i.bak 's/🔄/[<>]/g' tasks.md
    echo "Replaced with ASCII alternatives"
    ;;
  3)
    # Replace with text
    sed -i.bak 's/⬜/[TODO]/g' tasks.md
    sed -i.bak 's/🟨/[WIP]/g' tasks.md
    sed -i.bak 's/✅/[DONE]/g' tasks.md
    sed -i.bak 's/❌/[BLOCKED]/g' tasks.md
    sed -i.bak 's/🔄/[REVIEW]/g' tasks.md
    echo "Replaced with text alternatives"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo "Done! Original saved as tasks.md.bak"