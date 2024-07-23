import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import debug from 'debug';
import Listr from 'listr';
import { getAttributeValues, changeAttributeValues } from './manipulateHtml.js';
import createName from './createName.js';

const log = debug('page-loader');

const tags = [
  { tag: 'img', attr: 'src' },
  { tag: 'link', attr: 'href' },
  { tag: 'script', attr: 'src' },
];

const getFilePaths = (html) => tags.reduce((acc, { tag, attr }) => {
  const newAcc = [...acc, getAttributeValues(html, tag, attr)];
  return newAcc.flat();
}, []);

const isLocal = (url, mainUrl) => {
  const mainUrlObject = new URL(mainUrl);
  const urlObject = new URL(url, mainUrl);
  return urlObject.host === mainUrlObject.host;
};

const downloadFiles = (onlyLocalUrls, dirForFiles) => onlyLocalUrls.map((localUrl) => ({
  title: localUrl.href,
  task: () => axios.get(localUrl.href, { responseType: 'stream' })
    .then(({ data, config: { url } }) => {
      fs.writeFile(path.join(dirForFiles, createName(url)), data);
    }),
}));

const getNewFilePath = (filePath, url) => ((isLocal(filePath, url)) ? `${createName(url, 'dir')}/${createName(filePath)}` : filePath.href);

const getNewFilePaths = (filePaths, url) => filePaths.reduce((acc, filePath) => {
  const newAcc = ({ ...acc, [filePath]: getNewFilePath(new URL(filePath, url), url) });
  return newAcc;
}, {});

export default (url, dirpath = process.cwd()) => {
  log(`Loading '${url}' to directory '${dirpath}' starts!`);
  const htmlFilepath = path.join(dirpath, createName(url));
  const dirForFiles = path.join(dirpath, createName(url, 'dir'));
  let html;
  let filePaths;
  return axios.get(url)
    .then((response) => {
      html = response.data;
    })
    .then(() => {
      filePaths = getFilePaths(html, tags);
    })
    .then(() => fs.mkdir(dirForFiles))
    .then(() => filePaths.map((filepath) => new URL(filepath, url)))
    .then((fileUrls) => fileUrls.filter(({ href }) => isLocal(href, url)))
    .then((onlyLocalUrls) => {
      const params = { concurrent: true, exitOnError: false };
      const tasks = new Listr(downloadFiles(onlyLocalUrls, dirForFiles), params);
      return tasks.run();
    })
    .then(() => changeAttributeValues(html, tags, getNewFilePaths(filePaths, url)))
    .then((updateHtml) => fs.writeFile(htmlFilepath, updateHtml))
    .then(() => {
      log(`Page was successfully downloaded into '${htmlFilepath}'`);
      return htmlFilepath;
    })
    .catch((e) => {
      log(`${e}`);
      throw new Error(e);
    });
};
