# Tests API
Tests should extend the base class, found in `/src/baseClasses/Test.js`

Tests are expected to manage their own configuration after initial construction.

## Methods to be overwritten
### `.test()`
This method will be called whenever the `test` instance is to be checked. It should
return a `Promise` that will resolve or reject with JSON data relevant to either scenario.
The data will be stored against the resolution in logging.
#### defaults to
Throws Error

### `.verifyConfig()`
This method will be called to check that the instance is correctly configured (to
it's knowledge).
You should overwrite this method if you wish to perform
#### defaults to
returns `true`

### `.optionsSchema()`
This method should return a JSON schema, which can be used to verify that the
configuration supplied will be accepted
#### defaults to
"anything" JSON
