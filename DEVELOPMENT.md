# Development Guide for New Features

This document outlines the steps to develop and integrate new features into the `@puppedo/walk-sync` project.

## General Workflow

1. **Create a New Branch**
   - Use a descriptive name for the branch, e.g., `feature/<feature-name>`.
   - Example:
     ```bash
     git checkout -b feature/new-feature
     ```

2. **Define the Feature**
   - Clearly define the purpose and scope of the feature.
   - Update the `README.md` file if the feature impacts the public API.

3. **Write Tests**
   - Add unit tests in the `src.tests/` directory.
   - Ensure tests cover edge cases and expected behavior.

4. **Implement the Feature**
   - Write the code in the appropriate `src/` files.
   - Follow the existing coding style and conventions.

5. **Update Documentation**
   - Update or create relevant documentation in the `docs/` folder.
   - Ensure the `API Documentation` reflects the new feature.

6. **Run Tests**
   - Execute all tests to ensure nothing is broken.
   - Example:
     ```bash
     npm test
     ```

7. **Generate Coverage Report**
   - Run the coverage script to ensure sufficient test coverage.
   - Example:
     ```bash
     npm run coverage
     ```

8. **Commit Changes**
   - Use clear and descriptive commit messages.
   - Example:
     ```bash
     git add .
     git commit -m "Add <feature-name>: <short-description>"
     ```

9. **Push and Create a Pull Request**
   - Push the branch to the remote repository.
   - Create a pull request and request reviews.

## Example: Adding a New Option to `walkSync`

### Feature: `followSymlinks`

1. **Define the Feature**
   - Add an option `followSymlinks` to the `walkSync` function to include files from symbolic links.

2. **Write Tests**
   - Add tests in `src.tests/test.spec.ts` to verify the behavior of `followSymlinks`.

3. **Implement the Feature**
   - Modify `src/walkSync.ts` to handle the `followSymlinks` option.

4. **Update Documentation**
   - Update `README.md` and `docs/walk-sync.walksyncoptions.md` to include `followSymlinks`.

5. **Run Tests and Generate Coverage**
   - Ensure all tests pass and coverage is adequate.

6. **Commit and Push**
   - Commit the changes and push the branch.

7. **Create a Pull Request**
   - Open a pull request and request reviews from the team.

---

By following this guide, you can ensure that new features are developed and integrated smoothly into the project.
