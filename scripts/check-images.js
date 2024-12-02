const fs = require('fs');
const path = require('path');
const glob = require('glob');

function checkImageAttributes() {
  const files = glob.sync('src/**/*.{tsx,jsx}');
  const issues = [];

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for img tags without alt
    const imgTagsWithoutAlt = content.match(/<img(?![^>]*alt=)[^>]*>/g);
    if (imgTagsWithoutAlt) {
      issues.push(`${file}: Missing alt attribute in img tag`);
    }

    // Check for Image component without alt
    const imageComponentWithoutAlt = content.match(/<Image(?![^>]*alt=)[^>]*>/g);
    if (imageComponentWithoutAlt) {
      issues.push(`${file}: Missing alt attribute in Image component`);
    }

    // Check for missing src
    const tagsWithoutSrc = content.match(/<(img|Image)(?![^>]*src=)[^>]*>/g);
    if (tagsWithoutSrc) {
      issues.push(`${file}: Missing src attribute in image`);
    }
  });

  if (issues.length > 0) {
    console.log('Image attribute issues found:');
    issues.forEach(issue => console.log(issue));
    process.exit(1);
  } else {
    console.log('All images have required attributes');
  }
}

checkImageAttributes();
