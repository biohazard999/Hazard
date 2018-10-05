# Hazard

[![Build Status](https://mgrundner.visualstudio.com/Scissors/_apis/build/status/biohazard999.Hazard)](https://mgrundner.visualstudio.com/Scissors/_build/latest?definitionId=49)

Hazard is a language and a compiler to produce IL written in typescript.

> This is a WIP and not production ready yet!

## Prerequisites

* `node >= 8.12.0`
* `npm >= 6.4.1`

> Those are my installed and tested versions, it may work with lower versions but i did not test those.

## Building & Consumption

Run `npm install` to restore the dependencies, then you can just `npm start` to start the REPL.

| Action   | Command         | Description                                                           |
|----------|-----------------|-----------------------------------------------------------------------|
| build    | `npm run build` | Builds the project                                                    |
| test     | `npm run test`  | Runs the tests                                                        |
| start    | `npm start`     | Starts the REPL                                                       |
| clean    | `npm run clean` | Cleans build artifacts                                                |
| coverage | `npm run cov`   | Opens the coverage report in a browser. You'll need to run test first |

## Motivation

The main reason I do this project is the project [minsk](https://github.com/terrajobst/minsk) from Immo Landwerth. He does the project in C#. So basically I try to follow his project and implement my own version of minsk, but written in typescript. Looks like a challange.
