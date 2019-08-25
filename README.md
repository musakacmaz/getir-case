# getir-case  

## Overview

A RESTful API with a single endpoint that fetches the data in the provided MongoDB collection and return the results in the requested format.

## Requirements

For development, you will need [Node.js](https://nodejs.org) and a node global package manager.

If the installation was successful, you should be able to run the following command.
```
$ node --version

v10.15.3

$ npm --version

6.4.1
```

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.
```
$ npm install npm -g
```
## Installation

```
$ git clone https://github.com/musakacmaz/getir-case

$ cd getir-case

$ npm install
```

## Running

```
$ node index.js
```
Your app should now be running on [localhost:8080](http://localhost:8080/).

## Basic use

The request payload will include a JSON with 4 fields. 
- “startDate” and “endDate” fields will contain the date in a “YYYY-MM-DD” format.
- “minCount” and “maxCount” are for filtering the data. Sum of the “count” array in the documents should be between “minCount” and “maxCount”.
- Sample: { "startDate": "2016-01-26", "endDate": "2018-02-02", "minCount": 2700, "maxCount": 3000 }

## API 
The one and only endpoint of the API is 'api/search'.

API can be tested on https://powerful-reef-74039.herokuapp.com/api/search

## Examples

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b9a04a02a10170619578)

## Deploying to Heroku
```
heroku create
git push heroku master
heroku open
```
## Tests

[Jest](https://jestjs.io/) framework has been used in order to running tests.

```
$ npm run test
```

## Contributors

Musa Kaçmaz

## License

 Apache License 2.0
