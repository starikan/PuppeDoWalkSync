# @puppedo/walk-sync

Synchronously walks through a directory and its subdirectories, returning an array of file paths.

![Coverage](https://raw.githubusercontent.com/starikan/PuppeDoWalkSync/main/badges/coverage.svg)

## Installation

```bash
npm install @puppedo/walk-sync
```

## Usage

```typescript
import { walkSync } from '@puppedo/walk-sync';

const files = walkSync('./my-directory', {
  ignoreFolders: ['node_modules', '.git'], // Optional: folders to exclude from the walk
  includeExtensions: ['.ts', '.js'], // Optional: only include files with these extensions
  ignoreFiles: ['.eslintrc.js', 'tsconfig.json'], // Optional: specific files to exclude
  depth: 2, // Optional: limits the recursion depth
  onlyFiles: ['package.json', 'index.ts'], // Optional: include only specific files
});

console.log(files); // Output: array of file paths
```

## API

[API Documentation](https://github.com/starikan/PuppeDoWalkSync/blob/main/docs/index.md)

## License

ISC
