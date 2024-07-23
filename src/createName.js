import path from 'path';

const replace = (string) => string.replace(/(\W)/g, '-');

export default (url, type = 'file') => {
  const objectUrl = new URL(url);
  const { host, pathname } = objectUrl;
  const { dir, name, ext } = path.parse(pathname);
  if (type === 'dir') {
    return `${replace(host)}${replace(dir)}${replace(name)}_files`;
  }
  return (ext) ? `${replace(host)}${replace(dir)}-${replace(name)}${ext}` : `${replace(host)}${replace(dir)}${replace(name)}.html`;
};
