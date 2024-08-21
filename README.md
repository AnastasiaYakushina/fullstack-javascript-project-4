<h1>Загрузчик страниц (PageLoader)</h1>

[![Actions Status](https://github.com/AnastasiaYakushina/fullstack-javascript-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/AnastasiaYakushina/fullstack-javascript-project-4/actions)

В проекте применялись:
- разработка через тестирование (TDD) с использованием мокинга, асинхронного кода (async/await)
- работа с библиотеками: axios, cheerio, commander, debug, jest, nock, fs, path
- промисы (then, catch) в основном коде программы
- обработка HTML-кода
- логирование, обработка ошибок

<h4>Программа (командная утилита) скачивает страницу из интернета вместе со всеми ресурсами: изображениями, стилями, скриптами.</h4>

<h4>Установка</h4>
<ul>
<li>git clone ...</li>
<li>cd fullstack-javascript-project-4</li>
<li>npm ci</li>
<li>npm link</li>
</ul>


<h4>Запуск</h4>
<ul>
<li>page-loader url</li>
</ul>

Страница по умолчанию скачивается в текущую директорию.
Для выбора директории применяется опция --output.

Пример работы программы:

[![asciicast](https://asciinema.org/a/stooN2aU6yhyz508z3M17xkZ8.svg)](https://asciinema.org/a/stooN2aU6yhyz508z3M17xkZ8)
