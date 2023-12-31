#!/usr/bin/env node

import { program } from 'commander';
import download from '../src/download.js';

program
  .description('Page loader utility')
  .version('1.0.0')
  .argument('url')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')
  .action((url, options) => {
    download(url, options.output);
  });

program.parse();
