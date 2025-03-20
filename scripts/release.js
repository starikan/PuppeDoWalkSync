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

    console.log(`Current package.json version: ${currentVersion}`);
    console.log(`Last published version: ${lastPublishedVersion}`);

    rl.question('Enter new version (major.minor.patch): ', (version) => {
      if (!semver.valid(version)) {
        console.error('Invalid version format. Please use major.minor.patch');
        rl.close();
        process.exit(1);
      }

      if (semver.lte(version, lastPublishedVersion)) {
        console.error(`New version (${version}) must be greater than last published version (${lastPublishedVersion})`);
        rl.close();
        process.exit(1);
      }

      resolve(version);
      rl.close();
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
    const latestNotesPath = path.resolve(releasesDir, 'latest.txt');
    console.log('Generating release notes...');
    generateReleaseNotes({ outputFile: latestNotesPath });

    console.log('\nPlease review the release notes in:');
    console.log(latestNotesPath);
    console.log('\nAfter reviewing:');
    console.log('1. Make any necessary edits to the release notes');
    console.log(`2. Rename the file to "v${newVersion}.txt" if you're satisfied`);
    console.log(`3. Commit changes: git commit -a -m "Prepare release v${newVersion}"`);
    console.log('4. Push changes: git push origin main');
    console.log('5. Go to GitHub Actions and manually trigger the release workflow');

    // Ask if the user wants to proceed with commit
    // eslint-disable-next-line global-require
    const readline = require('readline');
    const rl2 = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl2.question('\nDo you want to rename the file and commit changes now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        // Rename file
        const versionedNotesPath = path.resolve(releasesDir, `v${newVersion}.txt`);
        fs.renameSync(latestNotesPath, versionedNotesPath);
        console.log(`Renamed to ${versionedNotesPath}`);

        // Commit changes
        execSync(`git add . && git commit -m "Prepare release v${newVersion}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });

        console.log('\nChanges pushed to main branch.');
        console.log(`Go to GitHub Actions and manually trigger the release workflow with version v${newVersion}.`);
      }
      rl2.close();
    });
  } catch (error) {
    console.error('Error during release process:', error);
  }
}

release();
