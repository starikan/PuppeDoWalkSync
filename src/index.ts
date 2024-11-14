import path from 'path';
import fs from 'fs';

/**
 * Synchronously walks through a directory and its subdirectories, returning an array of file paths.
 *
 * @param dir - The directory to start walking from.
 * @param options - An object with options for the walk.
 * @param options.ignoreFolders - An array of folder names to ignore.
 * @param options.includeExtensions - An array of file extensions to include.
 * @param options.ignoreFiles - An array of file names to ignore.
 * @param options.depth - The maximum depth to walk.
 * @returns An array of file paths.
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
