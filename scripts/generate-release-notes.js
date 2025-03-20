const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generate release notes from git commits since the previous tag
 * @param {Object} options - Options for generating release notes
 * @param {string} [options.outputFile] - Path to save release notes
 * @returns {string} The generated release notes
 */
function generateReleaseNotes(options = {}) {
  try {
    // Get the current tag if it exists, otherwise use HEAD
    let currentTag;
    try {
      currentTag = execSync('git describe --tags --exact-match').toString().trim();
    } catch (error) {
      // If no exact match tag is found, use latest commit or a placeholder
      currentTag = 'HEAD';
      console.log('No exact tag found for current commit, using HEAD reference');
    }

    // Check if there are any tags in the repository
    let previousTag;
    let commitRange;

    try {
      // Try to get the previous tag
      previousTag = execSync(`git describe --tags --abbrev=0 ${currentTag}^`).toString().trim();
      commitRange = `${previousTag}..${currentTag}`;
      console.log(`Generating release notes from ${previousTag} to ${currentTag}`);
    } catch (error) {
      // If no tags exist, get all commits
      console.log('No previous tag found, using all commits');
      previousTag = 'Initial commit';
      commitRange = currentTag;
    }

    // Get commits between tags (or all commits) and categorize them
    const commits = execSync(`git log ${commitRange} --pretty=format:"%s|%h"`).toString().split('\n');

    const features = [];
    const fixes = [];
    const other = [];

    commits.forEach((commit) => {
      const [message, hash] = commit.split('|');

      if (message.toLowerCase().startsWith('fix') || message.toLowerCase().includes('bug')) {
        fixes.push(`- ${message} (${hash})`);
      } else if (message.toLowerCase().startsWith('feat') || message.toLowerCase().includes('feature')) {
        features.push(`- ${message} (${hash})`);
      } else {
        other.push(`- ${message} (${hash})`);
      }
    });

    // Construct release notes
    let notes = `# Release ${currentTag}\n\n`;

    if (features.length > 0) {
      notes += `## New Features\n\n${features.join('\n')}\n\n`;
    }

    if (fixes.length > 0) {
      notes += `## Bug Fixes\n\n${fixes.join('\n')}\n\n`;
    }

    if (other.length > 0) {
      notes += `## Other Changes\n\n${other.join('\n')}\n\n`;
    }

    // Save to file if outputFile is specified
    if (options.outputFile) {
      const outputDir = path.dirname(options.outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(options.outputFile, notes);
      console.log(`Release notes saved to ${options.outputFile}`);
    }

    return notes;
  } catch (error) {
    console.error('Error generating release notes:', error.message);
    return '## Release Notes\n\nNo release notes available.';
  }
}

// If running as a script, print the release notes to stdout
if (require.main === module) {
  console.log(generateReleaseNotes());
}

module.exports = { generateReleaseNotes };
