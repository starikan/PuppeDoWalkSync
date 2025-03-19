/**
 * Options for configuring the walkSync function behavior.
 *
 * @remarks
 * This interface provides configuration options for the {@link walkSync} function.
 *
 * @public
 */

export interface WalkSyncOptions {
  /**
   * Array of folder names to ignore (e.g., `['node_modules', '.git']`)
   */
  ignoreFolders?: string[];

  /**
   * Array of file extensions to include (e.g., `['.ts', '.js']`)
   */
  includeExtensions?: string[];

  /**
   * Array of file names to ignore (e.g., `['.eslintrc.js']`)
   */
  ignoreFiles?: string[];

  /**
   * Maximum depth to walk (`1` = only files in the immediate directory)
   */
  depth?: number;

  /**
   * Array of specific file names to include
   */
  onlyFiles?: string[];
}
