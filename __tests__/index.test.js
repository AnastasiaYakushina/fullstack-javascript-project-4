import { fileURLToPath } from 'url';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import nock from 'nock';
import downloadPage from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);

nock.disableNetConnect();

const url = 'https://ru.hexlet.io/courses';
let tempdir;
let response;
let filepath;

beforeEach(async () => {
  tempdir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  response = await fs.readFile(getFixturePath('page.html'), 'utf-8');
  filepath = path.join(tempdir, 'ru-hexlet-io-courses.html');
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, response);
});

test('return correct filepath', async () => {
  const actual = await downloadPage(url, tempdir);
  expect(actual).toBe(filepath);
});

test('write file', async () => {
  await downloadPage(url, tempdir);
  const actual = await fs.readFile(filepath, 'utf-8');
  expect(actual).toBe(response);
});

// test('non-existent dir', async () => {
//   await expect(() => {
//    downloadPage(url, 'no_dir');
//   }).toThrow();
// });
