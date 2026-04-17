# AI Agent Assistant Chrome Extension

This is the Chrome Extension component of the AI-Agent MERN system. It allows you to select text on any webpage and save it directly to your research projects.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select this directory (`c:\Ashu\AI-Agent\extension`).

## Features

- **Text Capture**: Automatically detects text selection on any webpage.
- **Glassmorphism UI**: Modern, dark-themed popup for easy management.
- **API Integration**: Connects to the MERN backend (default: `http://localhost:5000/api`).
- **Project Organization**: Save snippets to specific projects.

## Structure

- `manifest.json`: Extension configuration (V3).
- `content.js`: Captures text from webpages.
- `popup.html/css/js`: The extension's user interface and logic.
- `icons/`: Extension icons.
