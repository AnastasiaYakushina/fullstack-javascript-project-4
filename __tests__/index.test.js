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

let tempdir;
let response;

beforeEach(async () => {
  tempdir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  response = await fs.readFile(getFixturePath('page.html'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, response);
});

test('return correct filepath', async () => {
  const filepath = await downloadPage('https://ru.hexlet.io/courses', tempdir);
  expect(filepath).toBe('ru-hexlet-io-courses.html');
});

test('write file', async () => {
  await downloadPage('https://ru.hexlet.io/courses', tempdir);
  const actual = await fs.readFile(path.join(tempdir, 'ru-hexlet-io-courses.html'), 'utf-8');
  expect(actual).toBe(response);
});

test('non-existent dir', () => {
  expect(() => {
    downloadPage('url', 'non_existent_dir');
  }).toThrow('No such directory');
});
