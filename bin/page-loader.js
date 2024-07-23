#!/usr/bin/env node

import { program } from 'commander';
import debug from 'debug';
import loadPage from '../src/index.js';

program
  .version('1.0.0')
  .description('Page loader utility')
  .option('-o, --output <dir>', 'output dir (default: "/home/user/current-dir")')
  .argument('<url>')
  .action((url) => {
    const options = program.opts();
    debug.enable('page-loader, axios');
    loadPage(url, options.output)
      .then((filepath) => console.log(filepath))
      .catch(({ message }) => {
        console.error(message);
        process.exit(1);
      });
  });

program.parse(process.argv);
