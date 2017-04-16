# How to contribute

This project is an outcome of a lot of contributions from developers who have been kind enough to point out any issues and/or have taken the time to create pull requests that fix issues or add new features to this repo. In other words, contributions are welcome :) Here are some guidelines to consider:

- The jQuery timer plugin is written in ES 5. It was written in ES 6 when I once felt that the browsers will catchup to ES6 and we ll not have to transpile anymore. The transpiled version of the jQuery timer adds 30% cruft to the code just to manage the fancy syntax. I moved away from it coz I realized users of this plugin don't care about that and should not be subjected to it.
- All source code is in the `src` directory. Any changes you make should ideally happen in the files inside `src` (unless you are making changes to the README or this file itself)
- To start contributing code changes, fork this repo to your Github account and clone it in your local computer
- Run `npm install` to install all the dependencies
- The package.json has all the required commands for you to test, lint, style check and put together a production file
    * `npm test` to run unit tests
    * `npm run build` for running jscs, jshint, concat and uglify to generate timer.jquery.js and timer.jquery.min.js inside dist/
    * `npm run watch` Watch over files from src and test as you work on them to running jscs, jshint, concat and uglify on changes
- Once you ve made the changes and are sure that the existing tests pass, commit them to your _origin_ and issue a Pull Request to the upstream (this repo)
- Please write tests for your changes

That's it. Time is precious, use it wisely & Happy Coding :)