# Oliver's Email Format Tool בסייעתא דשמ


## 📌 Overview
A tool that automatically converts incorrectly formatted election confirmation emails into properly structured forwarded messages, preserving all critical information while fixing formatting issues.

## ✨ Key Features
- **Automatic Header Parsing**  
  Extracts sender info, dates, and subjects from raw emails
- **Smart Date Conversion**  
  Converts dates to proper forwarding format (e.g., `Thu, Mar 13, 2025 at 12:50 PM`)
- **Name Customization**  
  Allows users to specify sender name (default: "Debrah Pavlich")
- **Forward Structure**  
  Generates proper email forwarding syntax with:
  - Clear separation of original message
  - Maintained metadata integrity
  - Consistent formatting

## 🛠️ Two Versions Available
1. **Python Script**  
python email_formatter.py input.txt output.txt

2. **Web Interface**  
Hosted on GitHub Pages:  
`[https://morph13nd.github.io/wzo/](https://morph13nd.github.io/wzo/)`

## 🔧 Technical Implementation
**Backend**  
graph TD
A[Raw Email Input] --> B(Parse Headers)
B --> C(Extract Body)
C --> D(Convert Dates)
D --> E[Generate Forward Format]

**Frontend**  
- Real-time conversion in browser
- Copy-to-clipboard functionality
- Responsive design for all devices

## ⚙️ Usage
1. **Web Version**  
   - Paste email → Click Convert → Copy result
2. **Python Script**  
from email_formatter import reformat_email
reformat_email("input.txt", "output.txt", "Your Name")

## 📂 Project Structure
├── index.html # Web interface
├── styles.css # Responsive design
├── script.js # Conversion logic
├── email_formatter.py # Python converter
└── README.md

## 🌐 Hosting
- Free GitHub Pages deployment
- Zero server requirements
- Client-side processing only

## ⚠️ Limitations
- Requires specific email header format
- Browser-based processing limitations
- Date parsing requires EN/US format

## 📄 License
MIT Licensed - Free for personal and commercial use
