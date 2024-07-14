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
const filesDirname = 'ru-hexlet-io-courses_files';
const imageName = 'ru-hexlet-io-assets-professions-nodejs.png';

let tempdir;
let response;
let filepath;
let image;

beforeEach(async () => {
  tempdir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  response = await fs.readFile(getFixturePath('before.html'), 'utf-8');
  filepath = path.join(tempdir, 'ru-hexlet-io-courses.html');
  image = await fs.readFile(getFixturePath('nodejs.png'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, response);
  nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.png')
    .reply(200, image);
});

test('return correct filepath', async () => {
  const actual = await downloadPage(url, tempdir);
  expect(actual).toBe(filepath);
});

test('write file', async () => {
  await downloadPage(url, tempdir);
  const files = await fs.readdir(tempdir);
  expect(files).toContain('ru-hexlet-io-courses.html');
});

test('create dir', async () => {
  await downloadPage(url, tempdir);
  const files = await fs.readdir(tempdir);
  expect(files).toContain(filesDirname);
});

test('replace links', async () => {
  await downloadPage(url, tempdir);
  const actual = await fs.readFile(filepath, 'utf-8');
  const expected = await fs.readFile(getFixturePath('after.html'), 'utf-8');
  expect(actual).toBe(expected);
});

test('download image', async () => {
  await downloadPage(url, tempdir);
  const imagepath = path.join(tempdir, filesDirname, imageName);
  const actual = await fs.readFile(imagepath, 'utf-8');
  expect(actual).toBe(image);
});

// test('non-existent dir', async () => {
//   await expect(() => {
//    downloadPage(url, 'no_dir');
//   }).toThrow();
// });
