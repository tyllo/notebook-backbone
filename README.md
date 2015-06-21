Тестовое приложение!
===================

![screenshots](https://lh4.googleusercontent.com/-8xzd-ooyoCU/VYaVloj32nI/AAAAAAAACOA/VZe6heT73BE/w916-h550-no/notebook-app-1.jpg)

**В приложении можно добавить контакт и его данные:**
 - Имя, фамилия, отчество, никнейм
 - Аватарку из списка предзагруженных аватарок в svg
 - Несколько телефонов, можно использовать только цифры `[0-9]`, круглые скобки `(` `)`, пробел `_`, `+` и `-`
 - Несколько электронных адресов
 - Адрес с фиксированным списком городов и улиц в выбранном городе. Города и улицы подгружаются с базы данных. Есть поле для удобного поиска города/улицы
 - Дату с удобным окном [выбора даты](http://xdsoft.net/jqplugins/datetimepicker/).
 - Добавить группу или выбрать из уже имеющимся
 - Выделить контакт как favorite

----------
###Установка

- Установите [Nodejs](https://nodejs.org) и пакетный менеджер [npm](https://www.npmjs.com)
- Установите пакеты
```
$ npm install -g bower gulp
```
- Клонируйте репозиторий или скопируйте на диск и [разархивируйте](https://github.com/tyllo/notebook-backbone/archive/master.zip):
```
$ git clone git@github.com:tyllo/notebook-backbone.git
```
-  Зайдите в папку проекта
```
$ cd notebook-backbone
```
- Установите все зависимости проекта,
автоматом создаться папка build с собранным проектом
```
$ npm install
```

----------
###Разработка

- Пересобрать проект:
```
$ gulp build
```
- Запустить вотчеры и локальный вебсервер localhost:3000:
```
$ gulp
```
----------
###Особенности
В проекте используются **препроцессоры** [jade](http://jade-lang.com) и [sass](http://sass-lang.com). 

**JS библиотеки** [require](http://requirejs.org), [jquery](http://jquery.com), [underscore](http://underscorejs.org), [backbone](http://backbonejs.org/).

**Фреймворки:** [bootstrap](http://getbootstrap.com/css/#sass), [font-awesome](http://fortawesome.github.io/Font-Awesome/)

Русифицированный **шрифт** [Lato](http://fonts4web.ru/lato.html) 

Пакет **аватарок** с сайта [freepik.com](http://www.freepik.com/free-vector/user-avatars-pack_746488.htm#term=avatar&page=1&position=22)

**Менеджер пакетов** [bower](http://bower.io) и **сборщик проектов** [Gulp](http://gulpjs.com)

CORS, REST

