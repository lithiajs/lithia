import { consola } from 'consola';
import { readdirSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { build as tsup } from 'tsup';

const format: 'esm' | 'cjs' = 'esm';

const subpaths = readdirSync(join(import.meta.dirname, 'src'), {
  withFileTypes: true,
})
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

async function build() {
  await tsup({
    name: 'lithia',
    entry: [...subpaths.map((subpath) => `src/${subpath}/index.ts`), 'src/index.ts'],
    target: 'esnext',
    platform: 'node',
    bundle: true,
    external: [...subpaths.map((subpath) => `lithia/${subpath}`)],
    dts: true,
    minify: false,
    treeshake: { preset: 'recommended' },
    format: [format],
    clean: true,
  });
}

function replaceCjsImports(content: string, path: string) {
  return content.replace(/require\(['"](lithia(?:\/[a-zA-Z0-9_-]+)?)['"]\)/g, (items, lithiaPath) => {
    const pathMap = subpaths.reduce(
      (acc, subpath) => {
        acc[`lithia/${subpath}`] = `./${subpath}`;
        return acc;
      },
      {} as Record<string, string>,
    );

    if (!pathMap[lithiaPath]) return items;

    let relativePath = relative(
      dirname(path),
      join(import.meta.dirname, 'dist', pathMap[lithiaPath], 'index.js'),
    ).replace(/\\/g, '/');

    if (relativePath[0] !== '.') relativePath = `./${relativePath}`;

    return `require('${relativePath}')`;
  });
}

function replaceEsmImports(content: string, path: string) {
  return content.replace(
    /(import|export)\s*\{([a-zA-Z0-9_,\s$]*)\}\s*from\s*['"](lithia(?:\/[a-zA-Z0-9_-]+)?)['"]/g,
    (match, type, items, lithiaPath) => {
      const pathMap = subpaths.reduce(
        (acc, subpath) => {
          acc[`lithia/${subpath}`] = `./${subpath}`;
          return acc;
        },
        {} as Record<string, string>,
      );

      if (!pathMap[lithiaPath]) return match;

      let relativePath = relative(
        dirname(path),
        join(import.meta.dirname, 'dist', pathMap[lithiaPath], 'index.js'),
      ).replace(/\\/g, '/');

      if (relativePath[0] !== '.') relativePath = `./${relativePath}`;

      return `${type} {${items}} from '${relativePath}'`;
    },
  );
}

async function updateImportPaths(path: string) {
  const content = await readFile(path, 'utf-8');
  let chunk = '';

  if (path.endsWith('.ts')) {
    chunk = replaceEsmImports(content, path);
  } else if (path.endsWith('.js')) {
    if (format === 'cjs') {
      chunk = replaceCjsImports(content, path);
    } else {
      chunk = replaceEsmImports(content, path);
    }
  }

  await writeFile(path, chunk, 'utf-8');
}

async function processDistFiles() {
  const files = await readdir(join(import.meta.dirname, 'dist'), {
    withFileTypes: true,
    recursive: true,
  });

  await Promise.all(
    files.map(async (file) => {
      if (!file.isFile()) return;
      const filePath = join(file.parentPath, file.name);
      await updateImportPaths(filePath);
    }),
  );
}

async function main() {
  try {
    await build();
    await processDistFiles();
  } catch (error) {
    consola.error(error);
    process.exit(1);
  }
}

main();
