# @puppedo/walk-sync

Synchronously walks through a directory and its subdirectories, returning an array of file paths.

## Installation

```bash
npm install @puppedo/walk-sync
```

## Usage

```typescript
import { walkSync } from '@puppedo/walk-sync';

const files = walkSync('./my-directory', {
  ignoreFolders: ['node_modules', '.git'],
  includeExtensions: ['.ts', '.js'],
  ignoreFiles: ['.eslintrc.js', 'tsconfig.json'],
  depth: 2, // Optional: limits the recursion depth
});

console.log(files); // Output: array of file paths
```

## API

### `walkSync(dir, options)`

- **`dir`**: `string` - The directory to start walking from.
- **`options`**: `object` - Options for the walk.
    - **`ignoreFolders`**: `string[]` - An array of folder names to ignore.
    - **`includeExtensions`**: `string[]` - An array of file extensions to include. If not provided, all file extensions are included.
    - **`ignoreFiles`**: `string[]` - An array of file names to ignore.  Matching is done against the full file name, not just the extension.
    - **`depth`**: `number` - The maximum depth to walk.  A value of `1` will only include files directly within the `dir` directory.  If not provided, there is no depth limit.

- **Returns**: `string[]` - An array of file paths.


## Examples

### Basic usage:

```typescript
const files = walkSync('./path/to/directory');
console.log(files);
```

### Ignoring folders:

```typescript
const files = walkSync('./path/to/directory', {
  ignoreFolders: ['node_modules', 'dist'],
});
console.log(files);
```

### Filtering by extension:

```typescript
const tsFiles = walkSync('./path/to/directory', {
  includeExtensions: ['.ts'],
});
console.log(tsFiles);
```

### Limiting recursion depth:

```typescript
const files = walkSync('./path/to/directory', {
  depth: 1, // Only files directly in the directory
});
console.log(files);
```

## License

ISC
