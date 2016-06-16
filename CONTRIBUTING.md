# How to contribute

This project is an outcome of a lot of contributions from developers who have been kind enough to point out any issues and/or have taken the time to create pull requests that fix issues or add new features to this repo. In other words, contributions are welcome :) Here are some guidelines to consider:

- The jQuery timer plugin is written in ES6. It uses babel along with webpack for transpiling to ES5
- All source code is in the `src` directory. Any changes you make should ideally happen in the files inside `src` (unless you are making changes to the README or this file itself)
- To start contributing code changes, fork this repo to your Github account and clone it in your local computer
- Run `npm install` to install all the dependencies
- The package.json has all the required commands for you to test and transpile
    * `npm test` to run eslint and the unit tests
    * `npm run webpack` to transpile the scripts from the _src_ directory to _dist/timer.jquery.js_
    * `npm grunt` for minifying the transpiled file to _dist/timer.jquery.min.js_
- Once you ve made the changes and are sure that the existing tests pass, commit them to your _origin_ and issue a Pull Request to the upstream (this repo)
- Please write tests for your changes

That's it. Happy coding!