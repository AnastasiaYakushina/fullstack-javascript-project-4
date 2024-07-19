import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { getAttributeValues, changeAttributeValues } from './manipulateHtml.js';
import generateName from './generateName.js';

const tags = [
  { tag: 'img', attr: 'src' },
  { tag: 'link', attr: 'href' },
  { tag: 'script', attr: 'src' },
];

const isLocal = (url, mainUrl) => {
  const mainUrlObject = new URL(mainUrl);
  const urlObject = new URL(url, mainUrl);
  return urlObject.host === mainUrlObject.host;
};

const getNewFilePath = (filePath, url) => {
  if (!isLocal(filePath, url)) {
    return filePath.href;
  }
  return `${generateName(url, 'dir')}/${generateName(filePath)}`;
};

export default (url, dirpath = process.cwd()) => {
  const htmlFilepath = path.join(dirpath, generateName(url));
  const filesDirpath = path.join(dirpath, generateName(url, 'dir'));
  let data;
  let filePaths;
  let fileUrls;
  return axios.get(url)
    .then((response) => {
      data = response.data;
    })
    .then(() => fs.mkdir(filesDirpath))
    .then(() => {
      filePaths = tags.reduce((acc, { tag, attr }) => {
        const newAcc = [...acc, getAttributeValues(data, tag, attr)];
        return newAcc.flat();
      }, []);
    })
    .then(() => {
      fileUrls = filePaths.map((filepath) => new URL(filepath, url));
    })
    .then(() => fileUrls.filter(({ href }) => isLocal(href, url)))
    .then((onlyLocalUrls) => onlyLocalUrls.map((localUrl) => axios.get(localUrl.href)))
    .then((promises) => Promise.all(promises))
    .then((files) => files.map((file) => fs.writeFile(path.join(filesDirpath, generateName(file.config.url)), file.data)))
    .then(() => {
      const newFilePaths = filePaths.reduce((acc, filePath) => ({ ...acc, [filePath]: getNewFilePath(new URL(filePath, url), url) }), {});
      data = changeAttributeValues(data, tags, newFilePaths);
    })
    .then(() => fs.writeFile(htmlFilepath, data))
    .then(() => htmlFilepath);
};
