# Instalation
1. Install node and bower dependencies
  ```npm install && bower install```
2. Start embedded web server
  ```gulp```
3. Open url [http://localhost:8080](http://localhost:8080) to open the app

# Notes
1. Share to Facebook will open error share dialog
2. Share to other than Facebook will open success share dialog

# General
The root folder the ```prototype``` or ```.```
in general, i use existing css and js lib as much as possible.
i also use existing html code.
so, a bit like refactoring plus UI update.
but i don't use the backend to speed up UI update process.
i use existing json data for dummy data.
i use folder-by-component instead of folder-by-type. so, most folder under ```/app``` is representing a single page.
most of the coding style that i use is based on [john papa angular guide](https://github.com/johnpapa/angular-styleguide)
