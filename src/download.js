import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const workingDir = process.cwd();

const generateName = (url) => {
  const formatUrl = url.replace(/https?:\/\//, '').replace(/[\W_]/g, '-');
  return `${formatUrl}.html`;
};

const download = (url, outputPath = workingDir) => {
  const dest = path.join(outputPath, generateName(url));
  console.log(dest);
  return axios.get(url)
    .then((result) => fs.writeFile(dest, result.data));
};

export default download;


