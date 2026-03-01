const devTools = [
  // JSON & DATA TOOLS
  { id: 1, title: "JSON Formatter", description: "Format and beautify JSON data for better readability.", category: "Data" },
  { id: 2, title: "JSON Validator", description: "Validate JSON structure and detect syntax errors instantly.", category: "Data" },
  { id: 3, title: "JSON Viewer", description: "View JSON data in a structured and readable format.", category: "Data" },
  { id: 4, title: "JSON Minifier", description: "Minify JSON by removing spaces and unnecessary characters.", category: "Data" },
  { id: 5, title: "JSON to CSV Converter", description: "Convert structured JSON data into CSV format.", category: "Data" },
  { id: 6, title: "JSON to XML Converter", description: "Convert JSON data into XML format instantly.", category: "Data" },
  { id: 7, title: "JSON to YAML Converter", description: "Transform JSON into YAML format easily.", category: "Data" },
  { id: 8, title: "CSV to JSON Converter", description: "Convert CSV files into structured JSON format.", category: "Data" },
  { id: 9, title: "XML to JSON Converter", description: "Convert XML data into JSON format.", category: "Data" },
  { id: 10, title: "YAML to JSON Converter", description: "Convert YAML files into JSON format.", category: "Data" },

  // ENCODING / DECODING
  { id: 11, title: "Base64 Encoder", description: "Encode text or files into Base64 format.", category: "Encode" },
  { id: 12, title: "Base64 Decoder", description: "Decode Base64 encoded strings instantly.", category: "Encode" },
  { id: 13, title: "URL Encoder", description: "Encode URLs safely for web transmission.", category: "Encode" },
  { id: 14, title: "URL Decoder", description: "Decode encoded URLs back to readable format.", category: "Encode" },
  { id: 15, title: "HTML Encoder", description: "Convert text into HTML encoded entities.", category: "Encode" },
  { id: 16, title: "HTML Decoder", description: "Decode HTML entities into readable text.", category: "Encode" },
  { id: 17, title: "JWT Decoder", description: "Decode and inspect JWT tokens securely.", category: "Encode" },
  { id: 18, title: "JWT Generator", description: "Generate custom JWT tokens with payload.", category: "Encode" },
  { id: 19, title: "Unicode Encoder", description: "Convert text into Unicode encoded format.", category: "Encode" },
  { id: 20, title: "Unicode Decoder", description: "Decode Unicode strings into readable text.", category: "Encode" },

  // CODE FORMATTING & MINIFICATION
  { id: 21, title: "HTML Beautifier", description: "Format and beautify messy HTML code.", category: "Formatting" },
  { id: 22, title: "HTML Minifier", description: "Minify HTML code for production use.", category: "Formatting" },
  { id: 23, title: "CSS Beautifier", description: "Format and organize CSS code properly.", category: "Formatting" },
  { id: 24, title: "CSS Minifier", description: "Compress CSS code by removing extra spaces.", category: "Formatting" },
  { id: 25, title: "JavaScript Beautifier", description: "Beautify and format JavaScript code.", category: "Formatting" },
  { id: 26, title: "JavaScript Minifier", description: "Minify JavaScript code for faster loading.", category: "Formatting" },
  { id: 27, title: "SQL Formatter", description: "Format SQL queries for better readability.", category: "Formatting" },
  { id: 28, title: "XML Formatter", description: "Format and beautify XML documents.", category: "Formatting" },
  { id: 29, title: "Markdown to HTML Converter", description: "Convert Markdown content into HTML instantly.", category: "Formatting" },
  { id: 30, title: "Code Diff Checker", description: "Compare two code blocks and highlight differences.", category: "Formatting" },

  // NUMBER & CONVERSION
  { id: 31, title: "Binary to Decimal Converter", description: "Convert binary numbers into decimal format.", category: "Converter" },
  { id: 32, title: "Decimal to Binary Converter", description: "Convert decimal numbers into binary format.", category: "Converter" },
  { id: 33, title: "HEX to RGB Converter", description: "Convert HEX color codes into RGB values.", category: "Converter" },
  { id: 34, title: "RGB to HEX Converter", description: "Convert RGB colors into HEX format.", category: "Converter" },
  { id: 35, title: "Timestamp Converter", description: "Convert Unix timestamps into readable dates.", category: "Converter" },
  { id: 36, title: "Unix Time Converter", description: "Convert date and time into Unix timestamp.", category: "Converter" },
  { id: 37, title: "Percentage Calculator", description: "Calculate percentages quickly and accurately.", category: "Converter" },
  { id: 38, title: "Random Number Generator", description: "Generate random numbers instantly.", category: "Converter" },

  // WEB & API TOOLS
  { id: 39, title: "API Response Viewer", description: "View and format API JSON responses.", category: "Web" },
  { id: 40, title: "HTTP Header Checker", description: "Check HTTP headers for any website URL.", category: "Web" },
  { id: 41, title: "IP Address Lookup", description: "Find details and location of any IP address.", category: "Web" },
  { id: 42, title: "User Agent Parser", description: "Analyze browser and device user agent strings.", category: "Web" },
  { id: 43, title: "DNS Lookup Tool", description: "Check DNS records including A, MX and TXT.", category: "Web" },
  { id: 44, title: "SSL Certificate Checker", description: "Verify SSL certificate validity and expiry date.", category: "Web" },
  { id: 45, title: "Redirect Checker", description: "Track and analyze website redirects.", category: "Web" },
  { id: 46, title: "cURL to Code Converter", description: "Convert cURL commands into programming code.", category: "Web" },

  // SECURITY & HASH
  { id: 47, title: "MD5 Generator", description: "Generate MD5 hash from text input.", category: "Security" },
  { id: 48, title: "SHA256 Generator", description: "Generate SHA256 encrypted hash.", category: "Security" },
  { id: 49, title: "SHA1 Generator", description: "Create SHA1 hash from any string.", category: "Security" },
  { id: 50, title: "Bcrypt Generator", description: "Generate Bcrypt hash securely.", category: "Security" },
  { id: 51, title: "Password Generator", description: "Generate strong and secure passwords.", category: "Security" },
  { id: 52, title: "Password Strength Checker", description: "Check password strength and security level.", category: "Security" },
  { id: 53, title: "HMAC Generator", description: "Generate HMAC hash using secret keys.", category: "Security" },
  { id: 54, title: "Hash Compare Tool", description: "Compare two hashes and verify integrity.", category: "Security" },

  // FILE & DATA UTILITIES
  { id: 55, title: "CSV Viewer", description: "View and analyze CSV files easily.", category: "File" },
  { id: 56, title: "CSV Editor", description: "Edit CSV files directly in browser.", category: "File" },
  { id: 57, title: "SQL to CSV Converter", description: "Convert SQL query results into CSV format.", category: "File" },
  { id: 58, title: "Text to CSV Converter", description: "Convert plain text into structured CSV format.", category: "File" },
  { id: 59, title: "CSV to SQL Converter", description: "Convert CSV data into SQL insert statements.", category: "File" },
  { id: 60, title: "XML Viewer", description: "View XML files in formatted structure.", category: "File" },
  { id: 61, title: "YAML Viewer", description: "View and analyze YAML files easily.", category: "File" },

  // PRODUCTIVITY TOOLS
  { id: 62, title: "Regex Tester", description: "Test and validate regular expressions instantly.", category: "Productivity" },
  { id: 63, title: "Regex Generator", description: "Generate regex patterns from examples.", category: "Productivity" },
  { id: 64, title: "Text Diff Checker", description: "Compare two texts and highlight differences.", category: "Productivity" },
  { id: 65, title: "UUID Generator", description: "Generate unique UUIDs instantly.", category: "Productivity" },
  { id: 66, title: "Lorem Ipsum Generator", description: "Generate placeholder Lorem Ipsum text.", category: "Productivity" },
  { id: 67, title: "Slug Generator", description: "Convert text into SEO-friendly URL slugs.", category: "Productivity" },
  { id: 68, title: "Case Converter", description: "Convert text to uppercase, lowercase or title case.", category: "Productivity" },
  { id: 69, title: "Character Counter", description: "Count characters and words in text instantly.", category: "Productivity" },
];

export default devTools;