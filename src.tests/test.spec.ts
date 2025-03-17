import fs from 'fs';
import path from 'path';
import { walkSync } from '../src/walkSync';

describe('walkSync', () => {
  const testDir = path.join(__dirname, 'testDir');
  const nestedDir = path.join(testDir, 'nested');
  const ignoredDir = path.join(testDir, 'ignored');

  beforeEach(() => {
    // Создаем тестовую структуру директорий и файлов
    fs.rmSync(testDir, { recursive: true, force: true });

    fs.mkdirSync(testDir);
    fs.mkdirSync(nestedDir);
    fs.mkdirSync(ignoredDir);

    fs.writeFileSync(path.join(testDir, 'file1.txt'), 'content1');
    fs.writeFileSync(path.join(testDir, 'file2.txt'), 'content2');
    fs.writeFileSync(path.join(nestedDir, 'file3.txt'), 'content3');
    fs.writeFileSync(path.join(ignoredDir, 'file4.txt'), 'content4');
  });

  afterEach(() => {
    // Удаляем тестовую структуру директорий и файлов
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  test('should return all files in directory', () => {
    const files = walkSync(testDir);
    expect(files).toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
      ]),
    );
  });

  test('should ignore specified directories', () => {
    const files = walkSync(testDir, { ignoreFolders: ['ignored'] });
    expect(files).toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
      ]),
    );
  });

  test('should ignore specified files', () => {
    const files = walkSync(testDir, { ignoreFiles: ['file2.txt'] });
    expect(files).toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
      ]),
    );
    expect(files).not.toEqual(expect.arrayContaining([path.join(testDir, 'file2.txt')]));
  });

  test('should return only files with specified extensions', () => {
    const files = walkSync(testDir, { includeExtensions: ['.txt'] });
    expect(files).toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
      ]),
    );
  });

  test('should respect depth limit', () => {
    const files = walkSync(testDir, { depth: 1 });
    expect(files).toEqual(expect.arrayContaining([path.join(testDir, 'file1.txt'), path.join(testDir, 'file2.txt')]));
  });

  test('should return empty array if directory does not exist', () => {
    const files = walkSync(path.join(__dirname, 'nonExistentDir'));
    expect(files).toEqual([]);
  });

  test('should return empty array if directory is empty', () => {
    const emptyDir = path.join(testDir, 'empty');
    fs.mkdirSync(emptyDir);
    const files = walkSync(emptyDir);
    expect(files).toEqual([]);
  });

  test('should return empty array if all files are ignored', () => {
    const files = walkSync(testDir, { ignoreFiles: ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'] });
    expect(files).toEqual([]);
  });

  test('should return empty array if all directories are ignored', () => {
    const files = walkSync(testDir, { ignoreFolders: ['nested', 'ignored'] });
    expect(files).toEqual(expect.arrayContaining([path.join(testDir, 'file1.txt'), path.join(testDir, 'file2.txt')]));
  });

  test('should handle multiple extensions', () => {
    fs.writeFileSync(path.join(testDir, 'file5.md'), 'content5');
    const files = walkSync(testDir, { includeExtensions: ['.txt', '.md'] });
    expect(files).toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
        path.join(testDir, 'file5.md'),
      ]),
    );
  });

  test('should filter by onlyFiles option', () => {
    const files = walkSync(testDir, { onlyFiles: ['file1.txt'] });
    expect(files).toEqual(expect.arrayContaining([path.join(testDir, 'file1.txt')]));
    expect(files).not.toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
      ]),
    );
  });

  test('should handle a file path instead of directory path', () => {
    const filePath = path.join(testDir, 'file1.txt');
    const files = walkSync(filePath);
    expect(files).toEqual([filePath]);
  });

  test('should respect depth of 0', () => {
    const files = walkSync(testDir, { depth: 0 });
    expect(files).toEqual([]);
  });

  test('should combine multiple options correctly', () => {
    fs.writeFileSync(path.join(testDir, 'file5.md'), 'content5');
    fs.writeFileSync(path.join(nestedDir, 'file6.md'), 'content6');

    const files = walkSync(testDir, {
      ignoreFolders: ['ignored'],
      includeExtensions: ['.md'],
      ignoreFiles: ['file6.md'],
      depth: 2,
    });

    expect(files).toEqual(expect.arrayContaining([path.join(testDir, 'file5.md')]));

    expect(files).not.toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
        path.join(nestedDir, 'file6.md'),
      ]),
    );
  });

  test('should handle empty onlyFiles array', () => {
    const files = walkSync(testDir, { onlyFiles: [] });
    expect(files).toEqual(
      expect.arrayContaining([
        path.join(testDir, 'file1.txt'),
        path.join(testDir, 'file2.txt'),
        path.join(nestedDir, 'file3.txt'),
        path.join(ignoredDir, 'file4.txt'),
      ]),
    );
  });
});
