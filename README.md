# 📋 Personal Clipboard Manager

A powerful, intelligent clipboard management tool with advanced tagging and filtering capabilities. Organize, categorize, and manage your clipboard content with ease.

🌟 **[Live Demo](https://yuzc-001.github.io/Clipboard/)**

## ✨ Features

### 🏷️ Tag Management System
- **Preset Tags**: Work, Personal, Code, Links, Notes, Temp
- **Custom Tags**: Add unlimited custom tags to organize your content
- **Tag Selector**: Dropdown menu for easy tag selection
- **Tag Removal**: Click the ✕ on any tag to remove it instantly

### 🎯 Smart Content Type Recognition
The application automatically detects and categorizes your content:

- **📝 Text** - Plain text content
- **📋 Markdown** - Markdown formatted content with proper rendering
- **💻 Code** - Code snippets with syntax highlighting
- **🔗 URL** - Web links with clickable formatting

### 🔍 Intelligent Filtering System
- **Filter Toggle**: ON/OFF button for complete control over filtering
- **Active Filter Display**: Shows currently applied filter tags
- **Clear All**: One-click removal of all filter conditions
- **Flexible Control**: Users decide when to enable filtering

### 🎨 Visual Enhancements
- **Type Icons**: Each content type has a distinctive icon
- **Tag Badges**: Beautiful, colorful tag display
- **Syntax Highlighting**: 
  - Code snippets: Green background
  - URLs: Blue underlines with hover effects
  - Markdown: Bold blue headers
- **Responsive Design**: Works seamlessly on desktop and mobile

### 💾 Data Persistence
- **Tag Storage**: Custom tags automatically saved to localStorage
- **Complete Export**: Export all content with tag information
- **Smart Recovery**: Restore all data when reloading the page
- **No Data Loss**: Your clipboard history is always preserved

## 🚀 Getting Started

### Online Version
Visit the live application: **[https://yuzc-001.github.io/Clipboard/](https://yuzc-001.github.io/Clipboard/)**

### Local Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/yuzc-001/Clipboard.git
   cd Clipboard
   ```

2. **Project Structure**
   ```
   Clipboard/
   ├── index.html          # Main application file
   ├── app/               # Application logic
   └── components/ui/     # UI components
   ```

3. **Run locally**
   ```bash
   # Option 1: Direct browser access
   open index.html
   
   # Option 2: Local server (recommended)
   python -m http.server 8000
   # Then visit: http://localhost:8000
   
   # Option 3: Using Node.js
   npx serve .
   ```

4. **Start organizing your clipboard!**

## 📖 How to Use

### Basic Operations
1. **Add Content**: Paste or type content into the input area
2. **Add Tags**: Select from preset tags or create custom ones
3. **Save**: Click save to add to your clipboard history
4. **Filter**: Use the filter system to find specific content quickly

### Advanced Features
- **Content Recognition**: The app automatically detects content type
- **Tag Management**: Create, use, and remove tags as needed
- **Export Data**: Download your entire clipboard history
- **Search & Filter**: Find content by tags or content type

## 🛠️ Technical Details

### Built With
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage for data persistence
- **Deployment**: GitHub Pages
- **Design**: Responsive CSS with modern UI elements

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 📱 Mobile Support
Fully responsive design that works perfectly on:
- 📱 Smartphones
- 📟 Tablets
- 💻 Desktops

## 🔒 Privacy & Security
- **Local Storage**: All data stored locally in your browser
- **No Server**: No data sent to external servers
- **Privacy First**: Your clipboard content stays private

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
```bash
git clone https://github.com/yuzc-001/Clipboard.git
cd Clipboard
# Start a local server for development
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this tool
- Inspired by the need for better clipboard management
- Built with modern web technologies for optimal performance

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yuzc-001/Clipboard/issues)
- **Repository**: [GitHub Repository](https://github.com/yuzc-001/Clipboard)

---

**Made with ❤️ for better productivity and organization**
