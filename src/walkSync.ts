import path from 'path';
import fs from 'fs';

/**
 * Synchronously walks through a directory and its subdirectories, returning an array of file paths.
 *
 * @public
 * @param dir - The directory to start walking from.
 * @param options - Options for the walk.
 * @remarks The `options` parameter can have the following properties:
 *   - `ignoreFolders`: An array of folder names to ignore. For example: `['node_modules', '.git']`.
 *   - `includeExtensions`: An array of file extensions to include. For example: `['.ts', '.js']`.
 *   - `ignoreFiles`: An array of file names to ignore. For example: `['.eslintrc.js', 'tsconfig.json']`.
 *   - `depth`: The maximum depth to walk. A value of `1` will only include files directly within the `dir` directory. For example: `{ depth: 1 }`.
 *   - `onlyFiles`: An array of file names to include. Only files matching these names will be included in the results. For example: `['package.json', 'tsconfig.json']`.
 * @returns - An array of file paths.
 *
 * @example
 * ```
 * // Basic usage:
 * const files = walkSync('./path/to/directory');
 * console.log(files);
 * ```
 *
 * @example
 * ```
 * // Ignoring folders:
 * const files = walkSync('./path/to/directory', {
 *   ignoreFolders: ['node_modules', 'dist'],
 * });
 * console.log(files);
 * ```
 *
 * @example
 * ```
 * // Filtering by extension:
 * const tsFiles = walkSync('./path/to/directory', {
 *   includeExtensions: ['.ts'],
 * });
 * console.log(tsFiles);
 * ```
 *
 * @example
 * ```
 * // Limiting recursion depth:
 * const files = walkSync('./path/to/directory', {
 *   depth: 1, // Only files directly in the directory
 * });
 * console.log(files);
 * ```
 *
 * @example
 * ```
 * // Including only specific files:
 * const configFiles = walkSync('./path/to/directory', {
 *   onlyFiles: ['package.json', 'tsconfig.json'],
 * });
 * console.log(configFiles);
 * ```
 */
export const walkSync = (
  dir: string,
  options: {
    ignoreFolders?: string[];
    includeExtensions?: string[];
    ignoreFiles?: string[];
    depth?: number;
    onlyFiles?: string[];
  } = {
    ignoreFolders: [],
    ignoreFiles: [],
  },
): string[] => {
  // Handle invalid directory input
  if (!dir || typeof dir !== 'string') {
    return [];
  }

  // Create a local copy of options with defaults
  const opts = options || { ignoreFolders: [], ignoreFiles: [] };

  // Ensure array properties are actually arrays
  if (opts.ignoreFolders && !Array.isArray(opts.ignoreFolders)) {
    opts.ignoreFolders = [];
  }
  if (opts.ignoreFiles && !Array.isArray(opts.ignoreFiles)) {
    opts.ignoreFiles = [];
  }
  if (opts.includeExtensions && !Array.isArray(opts.includeExtensions)) {
    opts.includeExtensions = [];
  }
  if (opts.onlyFiles && !Array.isArray(opts.onlyFiles)) {
    opts.onlyFiles = [];
  }

  const baseDir = path.basename(dir);
  if (!fs.existsSync(dir) || opts.ignoreFolders?.includes(baseDir)) {
    return [];
  }

  // TODO: 2025-03-17 S.Starodubov убрать дублирующую проверку ниже
  // Handle NaN or negative depth
  if (opts.depth !== undefined && (Number.isNaN(opts.depth) || opts.depth < 0)) {
    return [];
  }

  if (!fs.statSync(dir).isDirectory()) {
    return [dir];
  }

  const dirs = fs
    .readdirSync(dir)
    .map((f) => {
      if (opts.depth === undefined || opts.depth > 0) {
        return walkSync(path.join(dir, f), { ...opts, depth: opts.depth ? opts.depth - 1 : undefined });
      }
      return [];
    })
    .flat()
    .filter((v) => !opts.ignoreFiles?.some((s) => v.endsWith(s)))
    .filter((v) => (opts.includeExtensions?.length ? opts.includeExtensions.includes(path.parse(v).ext) : true))
    .filter((v) => {
      if (opts?.onlyFiles?.length) {
        return opts.onlyFiles.includes(path.basename(v));
      }
      return true;
    });
  return dirs;
};
