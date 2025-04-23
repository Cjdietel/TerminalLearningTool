// src/utils/path.js
/**
 * @param {string} pathStr
 * @param {object} fsMap   — your root FS map
 * @param {object} cwdMap  — your currentDirectory map
 */
export function resolvePath(pathStr, fsMap, cwdMap) {
    const isAbsolute = pathStr.startsWith('/');
    const tokens = pathStr
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);
  
    let mapping = isAbsolute ? fsMap : cwdMap;
  
    for (let i = 0; i < tokens.length - 1; i++) {
      const seg = tokens[i];
      const next = mapping[seg];
      if (!next || next.is_file) {
        throw new Error(
          `Not a directory: ${isAbsolute ? '/' : ''}${tokens.slice(0, i + 1).join('/')}`
        );
      }
      mapping = next.content;
    }
  
    const name = tokens[tokens.length - 1] || '';
    const node = name ? mapping[name] ?? null : null;
    return { parent: mapping, name, node };
  }
  