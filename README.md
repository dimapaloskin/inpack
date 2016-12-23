# Inpack [![Build Status](https://travis-ci.org/dimapaloskin/inpack.svg?branch=master)](https://travis-ci.org/dimapaloskin/inpack) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Inpack is a cli tool that makes it possible to use any directory as a Node.js module. It helps in avoiding long relative paths (like ```import responseParser from '../../../utils/responseParser';```) in your "require" or "import" without creating any additional files apart from its own config file called inpack.json.

## Screencast

[![asciicast](https://asciinema.org/a/eqwqbix1aw8vkn6fhb6zug5am.png)](https://asciinema.org/a/eqwqbix1aw8vkn6fhb6zug5am)

## Installation

Install it globally:

```bash
$ npm install -g inpack
```

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
 
Use next command in the project’s root directory (valid package.json is required):

```bash
~/Project $ inpack init
```

It will create inpack.json.

Use "add" to add existing directory as a Node.js module and save data to inpack.json:

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

## Commands list

### `inpack init`

Creates a new project in the current directory.

**Available options:**
- `--name` - project name (directory name by default)
- `--prefix` - prefix for added modules. It makes sense using this option if you want to avoid conflicts with other modules. For example, suppose the project’s prefix is `@Project/`. Then, a module named `MainComponent` can be accessed via `@Project/MainComponent`.
- `--add-postinstall` - adds or modifies the `postinstall` attribute in the existing package.json by adding the `inpack link` command.

### `inpack add [module/relative/path]`

Declares a directory as a Node.js module. Can be used in various ways:
`inpack add <relative-path>` - adds specified directory as a module relative to the inpack master
`inpack add` - adds current directory as a module.

 For example:
 ```bash
 ~/Project $ inpack add Components/MainComponent
 ```
 is equivalent to
 
 ```bash
 ~/Project/Components/MainComponent $ inpack add
 ```
 **Available options:**
 
 - `--name` - module name (directory name by default)
 - `--main` - main file, does the same as the "main" attribute from package.json does. `index.js` by default.
 - `--create` - creates a directory and main file, in case if either the directory or main file doesn’t exist.
 
### `inpack remove [module name]`

Removes specified module (from the configuration as well). Does not remove the source-directory. Can be used in various ways as well as ‘add’.

**Available options:**

- `--force` - removes the module even if it’s not declared in the configuration file.
 
### `inpack link`

Links all of the modules from inpack.json. Must be run from the master project.

### `inpack info [module name]`

**Alias:** resolve

Displays information about the module. Can be used in various ways as well as ‘add’ or ‘remove’.

### `inpack list`

Lists a brief information about all modules.

**Available options:**
- `--verbose` - lists the full information about all modules.

### Common options

Also there is the `—context-dir` option that is available for all of the commands and allows to specify a directory where you would like to run one or another command. For example:

```bash
~ $ inpack list 
✖ Searching for master project
Master project has not been found

~ $ inpack list --context-dir ./Project
[There goes the command output]
```

#### Author
[Dmitry Pavlovsky](http://palosk.in)
