const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { generateReleaseNotes } = require('./generate-release-notes');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getLastPublishedVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
    const packageName = packageJson.name;

    const npmInfo = JSON.parse(execSync(`npm view ${packageName} --json`, { encoding: 'utf8' }));
    return npmInfo.version || '0.0.0';
  } catch (error) {
    console.warn('Could not retrieve last published version, assuming 0.0.0');
    return '0.0.0';
  }
}

async function promptForVersion() {
  return new Promise((resolve) => {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
    const currentVersion = packageJson.version;
    const lastPublishedVersion = getLastPublishedVersion();

    // Display version information in a table format
    console.log('\n╔═════════════════════════╦═════════════════╗');
    console.log(`║ Current package version ║ ${currentVersion.padEnd(15)} ║`);
    console.log('╠═════════════════════════╬═════════════════╣');
    console.log(`║ Last published version  ║ ${lastPublishedVersion.padEnd(15)} ║`);
    console.log('╚═════════════════════════╩═════════════════╝\n');

    const majorBump = semver.inc(currentVersion, 'major');
    const minorBump = semver.inc(currentVersion, 'minor');
    const patchBump = semver.inc(currentVersion, 'patch');

    console.log('Available version options:');
    console.log(`1) Major bump: ${majorBump}`);
    console.log(`2) Minor bump: ${minorBump}`);
    console.log(`3) Patch bump: ${patchBump} (default)`);
    console.log('4) Custom version');

    rl.question('\nSelect option (1-4) or press Enter for default: ', (answer) => {
      let version;

      if (answer === '' || answer === '3') {
        version = patchBump;
      } else if (answer === '1') {
        version = majorBump;
      } else if (answer === '2') {
        version = minorBump;
      } else if (answer === '4') {
        rl.question('Enter custom version (major.minor.patch): ', (customVersion) => {
          if (!semver.valid(customVersion)) {
            console.error('Invalid version format. Please use major.minor.patch');
            rl.close();
            process.exit(1);
          }

          if (semver.lte(customVersion, lastPublishedVersion)) {
            console.error(
              `New version (${customVersion}) must be greater than last published version (${lastPublishedVersion})`,
            );
            rl.close();
            process.exit(1);
          }

          resolve(customVersion);
          rl.close();
        });
        return;
      } else {
        console.error('Invalid option. Using default patch bump.');
        version = patchBump;
      }

      if (semver.lte(version, lastPublishedVersion)) {
        console.error(
          `Warning: New version (${version}) is not greater than last published version (${lastPublishedVersion})`,
        );
        rl.question('Continue anyway? (y/n, default y): ', (cont) => {
          if (cont.toLowerCase() === 'n') {
            rl.close();
            process.exit(1);
          }
          resolve(version);
          rl.close();
        });
      } else {
        resolve(version);
        rl.close();
      }
    });
  });
}

function updatePackageJson(version) {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Updated package.json to version ${version}`);
}

async function release() {
  try {
    // Ensure we're on main branch and everything is up to date
    execSync('git checkout main && git pull', { stdio: 'inherit' });

    // Get new version
    const newVersion = await promptForVersion();

    // Update package.json with the new version
    updatePackageJson(newVersion);

    // Create releases directory if it doesn't exist
    const releasesDir = path.resolve(__dirname, '../releases');
    if (!fs.existsSync(releasesDir)) {
      fs.mkdirSync(releasesDir, { recursive: true });
    }

    // Generate release notes to latest.txt
    const latestNotesPath = path.resolve(releasesDir, `v${newVersion}.txt`);
    console.log('Generating release notes...');
    generateReleaseNotes({ outputFile: latestNotesPath });

    console.log('\nPlease review the release notes in:');
    console.log(latestNotesPath);
    console.log('\nAfter reviewing:');
    console.log('1. Make any necessary edits to the release notes');
    console.log(`2. Commit changes: git commit -a -m "Prepare release v${newVersion}"`);
    console.log('3. Push changes: git push origin main');
    console.log('4. Go to GitHub Actions and manually trigger the release workflow');
  } catch (error) {
    console.error('Error during release process:', error);
  }
}

release();
