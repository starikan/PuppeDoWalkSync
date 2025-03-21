import path from 'path';
import fs from 'fs';
import { WalkSyncOptions } from './types/WalkSyncOptions';

/**
 * Synchronously walks through a directory and its subdirectories, returning an array of file paths.
 *
 * @public
 * @param dir - The directory to start walking from.
 * @param options - Configuration options. See {@link WalkSyncOptions} for details.
 * @returns An array of file paths found during the walk.
 *
 * @example
 * Basic usage:
 * ```typescript
 * const files = walkSync('./path/to/directory');
 * console.log(files);
 * ```
 *
 * @example
 * Ignoring folders:
 * ```typescript
 * const files = walkSync('./path/to/directory', {
 *   ignoreFolders: ['node_modules', 'dist'],
 * });
 * console.log(files);
 * ```
 *
 * @example
 * Filtering by extension:
 * ```typescript
 * const tsFiles = walkSync('./path/to/directory', {
 *   includeExtensions: ['.ts'],
 * });
 * console.log(tsFiles);
 * ```
 *
 * @example
 * Limiting recursion depth:
 * ```typescript
 * const files = walkSync('./path/to/directory', {
 *   depth: 1, // Only files directly in the directory
 * });
 * console.log(files);
 * ```
 *
 * @example
 * Including only specific files:
 * ```typescript
 * const configFiles = walkSync('./path/to/directory', {
 *   onlyFiles: ['package.json', 'tsconfig.json'],
 * });
 * console.log(configFiles);
 * ```
 */
export const walkSync = (
  dir: string,
  options: WalkSyncOptions = {
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
