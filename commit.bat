@echo off
git config user.name "CineVerse Team"
git config user.email "info@cineverse.com"
git commit -m "Initial commit: CineVerse v2.0 - Enhanced animations and performance"
git branch -M main
git remote add origin https://github.com/alpeki/cineverse.git
git push -u origin main
