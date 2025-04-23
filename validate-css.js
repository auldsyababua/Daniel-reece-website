
const fs = require('fs');
const path = require('path');

// Check if the public directory exists
if (!fs.existsSync('public')) {
  console.error('Public directory not found. Run Hugo build first.');
  process.exit(1);
}

// Check if CSS files exist in public/css/
const cssDir = path.join('public', 'css');
if (!fs.existsSync(cssDir)) {
  console.error('CSS directory not found in public/.');
  process.exit(1);
}

// List all CSS files
const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
console.log('Found CSS files:', cssFiles);

// Check the first CSS file for content
if (cssFiles.length > 0) {
  const firstCssFile = path.join(cssDir, cssFiles[0]);
  const content = fs.readFileSync(firstCssFile, 'utf8');
  
  console.log(`First CSS file (${cssFiles[0]}) size: ${content.length} bytes`);
  console.log('First 200 characters:');
  console.log(content.substring(0, 200));
  
  // Check if it contains basic CSS selectors
  const hasTailwindClasses = content.includes('.bg-') || 
                             content.includes('.text-') || 
                             content.includes('.flex') || 
                             content.includes('.grid');
  
  if (hasTailwindClasses) {
    console.log('✅ CSS contains Tailwind classes');
  } else {
    console.log('❌ CSS does not contain expected Tailwind classes');
  }
} else {
  console.error('No CSS files found in public/css/');
}
