import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const workingDir = process.cwd();

const download = (url, outputPath = workingDir) => {
  const dest = path.join(outputPath, '/en-wikipedia-org-wiki-Asynchrony--computer-programming-.html');
  return axios.get(url)
    .then((result) => fs.writeFile(dest, result.data));
};

export default download;
