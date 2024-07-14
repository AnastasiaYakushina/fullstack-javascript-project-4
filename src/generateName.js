import path from 'path';

const replaceInvalidCharacters = (string) => string.replace(/(\W)/g, '-');

export const generateHtmlName = (url) => {
  const newURL = new URL(url);
  const { hostname, pathname } = newURL;
  return `${replaceInvalidCharacters(hostname)}${replaceInvalidCharacters(pathname)}.html`;
};

export const generateFilesDirName = (url) => {
  const newURL = new URL(url);
  const { hostname, pathname } = newURL;
  return `${replaceInvalidCharacters(hostname)}${replaceInvalidCharacters(pathname)}_files`;
};

export const generateImageName = (host, imagePath) => {
  const objectPath = path.parse(imagePath);
  const { dir, name, ext } = objectPath;
  return `${replaceInvalidCharacters(host)}${replaceInvalidCharacters(dir)}-${name}${ext}`;
};
