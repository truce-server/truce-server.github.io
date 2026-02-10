# Truce Server - Chatlog Archives

A beautiful React-based archive for Discord chatlog browsing with advanced search and filtering capabilities.

## ✨ Features

- **🎨 Modern UI**: Built with Mantine for a clean, aesthetic interface
- **🔍 Advanced Search**: Instant spotlight search across all chatlogs
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🌙 Dark Theme**: Discord-style dark theme with light mode toggle
- **📂 Smart Navigation**: Collapsible sidebar with folder organization
- **⚡ Fast Browsing**: Client-side routing for smooth navigation
- **📋 Easy Sharing**: Copy links to specific chatlogs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Your chatlog HTML files organized in folders

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Copy your chatlog folders**: 
   Make sure your chatlog HTML files are organized in folders in the root directory (like `Aaru/`, `Aether/`, etc.)

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open your browser**: Navigate to `http://localhost:3000`

### 🌐 Deploy to GitHub Pages

The repository is configured with GitHub Actions for automatic deployment:

1. **Push to main branch** - GitHub Actions will automatically:
   - Install dependencies
   - Copy chatlog folders to public directory
   - Generate sitemap.json
   - Build React app
   - Deploy to GitHub Pages

2. **Enable GitHub Pages**: 
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"
   - Your site will be live at `https://truce-server.github.io/truce-server.github.io`

## 📁 Project Structure

```
truce-server/
├── public/
│   ├── index.html
│   ├── sitemap.json (auto-generated)
│   └── [Chatlog folders copied here during build]
├── src/
│   ├── components/
│   │   ├── Sidebar.js
│   │   └── ChatlogViewer.js
│   ├── App.js
│   └── index.js
├── [Your chatlog folders]/
│   ├── Aaru/
│   ├── Aether/
│   └── ...
├── package.json
└── .github/workflows/deploy-react.yml
```

## 🎯 Usage

- **Browse Chatlogs**: Click folders in sidebar to expand and select conversations
- **Search**: Use Ctrl/Cmd + K or click search icon for instant search
- **Share Links**: Copy chatlog links using the copy button in the viewer
- **Toggle Theme**: Switch between dark and light modes with the theme button

## 🛠 Customization

### Colors & Theme
Edit `src/App.js` to customize the Mantine theme:

```javascript
theme={{
  primaryColor: 'blue', // Change primary color
  colors: {
    // Customize color palette
  }
}}
```

### Layout
Modify components in `src/components/` to adjust the interface layout.

## 📦 Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🤝 Contributing

Feel free to open issues or submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.