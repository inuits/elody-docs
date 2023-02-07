#!/bin/sh
cd /app/mkdocs
exec ~/.local/bin/mkdocs serve -a 0.0.0.0:8000
