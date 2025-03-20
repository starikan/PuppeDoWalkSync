## Releasing

### Manual Release Process

This project uses a fully manual release process:

1. To prepare a new release, run:
   ```
   npm run release
   ```

2. The script will:
   - Check that the new version is higher than the last published version
   - Update package.json with the new version
   - Generate release notes in `releases/latest.txt`
   - Prompt you to review and edit the release notes

3. After reviewing the release notes:
   - Rename `releases/latest.txt` to `releases/vX.Y.Z.txt` (the script can do this for you)
   - Commit changes and push to main (also automated if you choose)

4. To publish the release:
   - Go to the GitHub repository's "Actions" tab
   - Select the "Release & Publish" workflow
   - Click "Run workflow"
   - Enter the version number (e.g., 1.2.3)
   - Type "RELEASE" in the confirmation field
   - Click "Run workflow"

5. The workflow will:
   - Verify the package.json version matches the requested version
   - Check for the existence of the release notes file
   - Publish the package to npm
   - Create a GitHub release with your custom release notes

### Important Notes

- No git tags are created automatically
- Releases are only triggered manually via the GitHub Actions interface
- Release notes must be reviewed and prepared before triggering the release
- The release workflow will create a tag in GitHub when the release is published