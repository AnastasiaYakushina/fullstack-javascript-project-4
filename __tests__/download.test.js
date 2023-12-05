import nock from 'nock';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import download from '../src/download.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let tempDir;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

test('download', async () => {
  nock('https://en.wikipedia.org')
    .get('/wiki/Asynchrony_(computer_programming)')
    .replyWithFile(200, getFixturePath('test.url.html'), {
      'Content-Type': 'text/html',
    });

  const expected = await fs.readFile(getFixturePath('test.url.html'), 'utf8');
  await download(tempDir, 'https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)');
  const filePath = path.join(tempDir, '/en-wikipedia-org-wiki-Asynchrony--computer-programming-.html');
  const actual = await fs.readFile(filePath, 'utf8');
  expect(actual).toEqual(expected);
});
