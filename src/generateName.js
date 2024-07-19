import path from 'path';

const replace = (string) => string.replace(/(\W)/g, '-');

export default (url, type = 'file') => {
  const objectUrl = new URL(url);
  const { host, pathname } = objectUrl;
  if (type === 'dir') {
    return `${replace(host)}${replace(pathname)}_files`;
  }
  const { dir, name, ext } = path.parse(pathname);
  return (ext) ? `${replace(host)}${replace(dir)}-${replace(name)}${ext}` : `${replace(host)}${replace(pathname)}.html`;
};
