#!/usr/bin/env node

import { program } from 'commander';
import loadPage from '../src/index.js';

program
  .version('1.0.0')
  .description('Page loader utility')
  .option('-o, --output <dir>', 'output dir (default: "/home/user/current-dir")')
  .argument('<url>')
  .action((url) => {
    const options = program.opts();
    loadPage(url, options.output);
  });

program.parse(process.argv);
