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
const jsName = 'ru-hexlet-io-packs-js-runtime.js';
const cssName = 'ru-hexlet-io-assets-application.css';
const htmlName = 'ru-hexlet-io-courses.html';

let tempdir;
let htmlFilepath;

let html;
let image;
let js;
let css;

beforeEach(async () => {
  tempdir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  htmlFilepath = path.join(tempdir, htmlName);
  html = await fs.readFile(getFixturePath('before.html'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/courses')
    .twice()
    .reply(200, html);
  image = await fs.readFile(getFixturePath('nodejs.png'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/assets/professions/nodejs.png')
    .reply(200, image);
  js = await fs.readFile(getFixturePath('runtime.js'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/packs/js/runtime.js')
    .reply(200, js);
  css = await fs.readFile(getFixturePath('application.css'), 'utf-8');
  nock('https://ru.hexlet.io')
    .get('/assets/application.css')
    .reply(200, css);
});

test('return correct filepath', async () => {
  const actual = await downloadPage(url, tempdir);
  expect(actual).toBe(htmlFilepath);
});

test('write html', async () => {
  await downloadPage(url, tempdir);
  const files = await fs.readdir(tempdir);
  expect(files).toContain(htmlName);
});

test('create dir', async () => {
  await downloadPage(url, tempdir);
  const files = await fs.readdir(tempdir);
  expect(files).toContain(filesDirname);
});

test('replace links', async () => {
  await downloadPage(url, tempdir);
  const actual = await fs.readFile(htmlFilepath, 'utf-8');
  const expected = await fs.readFile(getFixturePath('after.html'), 'utf-8');
  expect(actual).toBe(expected);
});

test('download image', async () => {
  await downloadPage(url, tempdir);
  const filepath = path.join(tempdir, filesDirname, imageName);
  await expect(fs.readFile(filepath, 'utf-8')).resolves.toBe(image);
});

test('download js', async () => {
  await downloadPage(url, tempdir);
  const filepath = path.join(tempdir, filesDirname, jsName);
  await expect(fs.readFile(filepath, 'utf-8')).resolves.toBe(js);
});

test('download css', async () => {
  await downloadPage(url, tempdir);
  const filepath = path.join(tempdir, filesDirname, cssName);
  await expect(fs.readFile(filepath, 'utf-8')).resolves.toBe(css);
});

test('download html', async () => {
  await downloadPage(url, tempdir);
  const filepath = path.join(tempdir, filesDirname, htmlName);
  await expect(fs.readFile(filepath, 'utf-8')).resolves.toBe(html);
});

test.each([imageName, jsName, cssName, htmlName])('correct filename (%s)', async (filename) => {
  await downloadPage(url, tempdir);
  const files = await fs.readdir(path.join(tempdir, filesDirname));
  expect(files).toContain(filename);
});

// test('non-existent dir', async () => {
//   await expect(() => {
//    downloadPage(url, 'no_dir');
//   }).toThrow();
// });
