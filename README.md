# Inpack

Inpack is a cli tool that makes it possible to use any directory as a Node.js module. It helps in avoiding long relative paths (like ```import responseParser from '../../../utils/responseParser';```) in your "require" or "import" without creating any additional files apart from its own config file called inpack.json.

[![asciicast](https://asciinema.org/a/0wkld20ceezb6mybjslkk34l6.png)](https://asciinema.org/a/0wkld20ceezb6mybjslkk34l6)

## Usage example

Suppose we have a project with the following structure:
```
~/Project:
  Components
    MainComponent
      index.js
    WelcomeComponent
      index.js
  index.js
  package.json
 ```
 
Use next command in the project’s root directory.

```bash
~/Project $ inpack init
```

Valid package.json is required. It will create inpack.json.

Use "add" to add existing directory as a Node.js module and save data to inpack.json.

```bash
~/Project $ inpack add Component/MainComponent
```

From now on, your ‘Component/MainComponent' directory can be added anywhere in the project in following ways:

```js
const MainModule = require('MainModule');
// or
import MainModule from 'MainModule';

```

In future, if you need to deploy the project (or just clone it from github), you can simply run ‘link’. For example:

```bash
~/Project $ npm install
~/Project $ inpack link
```

All of your components are good to go now.
