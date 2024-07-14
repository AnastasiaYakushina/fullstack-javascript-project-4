import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import { getAttributeValues, changeAttributeValues } from './manipulateHtml.js';
import { generateHtmlName, generateFilesDirName, generateImageName } from './generateName.js';

export default (url, dirpath = process.cwd()) => {
  const objectURL = new URL(url);
  const { protocol, host } = objectURL;
  const htmlFilepath = path.join(dirpath, generateHtmlName(url));
  const filesDirpath = path.join(dirpath, generateFilesDirName(url));
  let data;
  let imagePaths;
  let imageNames;
  return axios.get(url)
    .then((response) => {
      data = response.data;
    })
    .then(() => fs.mkdir(filesDirpath))
    .then(() => {
      imagePaths = getAttributeValues(data, 'img', 'src');
    })
    .then(() => {
      imageNames = imagePaths.map((imagePath) => generateImageName(host, imagePath));
    })
    .then(() => imagePaths.map((imagePath) => axios.get(path.join(protocol, host, imagePath))))
    .then((promises) => Promise.all(promises))
    .then((images) => images.map((image, i) => fs.writeFile(path.join(filesDirpath, imageNames[i]), image.data)))
    .then(() => {
      const newImagePaths = imageNames.map((imageName) => path.join(generateFilesDirName(url), imageName));
      data = changeAttributeValues(data, 'img', 'src', newImagePaths);
    })
    .then(() => fs.writeFile(htmlFilepath, data))
    .then(() => htmlFilepath)
    .catch((e) => {
      throw new Error(e);
    });
};
