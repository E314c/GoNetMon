# Loggers API
Loggers should extend the base class, found in `/src/baseClasses/Logger.js`

a logger will receive data in on it's exposed `.logTestResults()` method. It will automatically have been subscribed to results from Tests as configured in it's `options.listensTo` section.

## Configuration
Like other modules, Loggers receive configuration via a configuration object, passed to the constructor and stored in `this.options`.

All logger instances should implement the following common options for configuring which test events are filtered for:
```JSON
"listensTo": {
    "oneOf": [
        {
            "enum": ["all", "fail", "pass"]
        },
        {
            "type": "array",
            "items": {
                "type": "string",
                "description": "name of test instance to listen for"
            }
        }
    ]
}
```
For this reason, it is recommended that your `.getOptionSchema()` override expands the schema given by the method on the base Logger class. 
