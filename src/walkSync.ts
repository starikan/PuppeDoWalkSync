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
 *   - `depth`: The maximum depth to walk.  A value of `1` will only include files directly within the `dir` directory.
 * @returns - An array of file paths.
 */
export const walkSync = (
  dir: string,
  options: { ignoreFolders?: string[]; includeExtensions?: string[]; ignoreFiles?: string[]; depth?: number } = {
    ignoreFolders: [],
    ignoreFiles: [],
  },
): string[] => {
  const baseDir = path.basename(dir);
  if (!fs.existsSync(dir) || options.ignoreFolders?.includes(baseDir)) {
    return [];
  }
  if (!fs.statSync(dir).isDirectory()) {
    return [dir];
  }
  const dirs = fs
    .readdirSync(dir)
    .map((f) => {
      if (options.depth === undefined || options.depth > 0) {
        return walkSync(path.join(dir, f), { ...options, depth: options.depth ? options.depth - 1 : undefined });
      }
      return [];
    })
    .flat()
    .filter((v) => !options.ignoreFiles?.some((s) => v.endsWith(s)))
    .filter((v) => (options.includeExtensions ? options.includeExtensions.includes(path.parse(v).ext) : true));
  return dirs;
};
