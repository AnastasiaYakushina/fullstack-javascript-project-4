import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';
import generateName from '../src/generateName.js';

export default (url, dirpath = process.cwd()) => {
  const filename = generateName(url);
  const filepath = path.join(dirpath, filename);
  return axios.get(url)
    .then((response) => fs.writeFile(filepath, response.data))
    .then(() => filepath)
    .catch((e) => {
      throw new Error(e);
    });
};
