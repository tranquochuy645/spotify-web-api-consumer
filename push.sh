#!bin/bash
pandoc -f html -t markdown README.html -o README.md
git add .
git commit -m "auto push"
git push