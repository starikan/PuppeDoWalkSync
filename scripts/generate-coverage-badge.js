const fs = require('fs');
const path = require('path');

function generateCoverageBadge() {
  try {
    // Read the coverage summary
    const coverageSummaryPath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
    if (!fs.existsSync(coverageSummaryPath)) {
      console.error('Coverage summary file not found. Run tests with coverage first.');
      return;
    }

    const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
    const coverage = summary.total.statements.pct;

    // Define badge color based on coverage percentage
    let color = 'red';
    if (coverage >= 90) color = 'brightgreen';
    else if (coverage >= 80) color = 'green';
    else if (coverage >= 70) color = 'yellowgreen';
    else if (coverage >= 60) color = 'yellow';
    else if (coverage >= 50) color = 'orange';

    // Generate SVG badge
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="106" height="20" role="img" aria-label="coverage: ${coverage}%">
  <title>coverage: ${coverage}%</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="106" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="61" height="20" fill="#555"/>
    <rect x="61" width="45" height="20" fill="#${color}"/>
    <rect width="106" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="315" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="510">coverage</text>
    <text x="315" y="140" transform="scale(.1)" fill="#fff" textLength="510">coverage</text>
    <text aria-hidden="true" x="825" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="350">${coverage}%</text>
    <text x="825" y="140" transform="scale(.1)" fill="#fff" textLength="350">${coverage}%</text>
  </g>
</svg>`;

    // Save badge to file
    const badgesDir = path.join(__dirname, '..', 'badges');
    if (!fs.existsSync(badgesDir)) {
      fs.mkdirSync(badgesDir, { recursive: true });
    }

    fs.writeFileSync(path.join(badgesDir, 'coverage.svg'), svg);
    console.log(`Coverage badge generated (${coverage}%)`);

    // Return coverage percentage for potential further use
    // return coverage;
  } catch (error) {
    console.error('Error generating coverage badge:', error);
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateCoverageBadge();
}

module.exports = generateCoverageBadge;
