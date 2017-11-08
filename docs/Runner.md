# Runners
Runner are wrappers for tests that will execute them at certain times and create events on the event pool when such a start fails or passes

A runner module should return a class (or similar instance creator function) as it's main export.
It is recommended that you extend the `Runner` class, as this will construct the base class and handle a few things for you.

## Runner Class
### Constructor args
This constructor will be call with the following:
 - `<GlobalEventPool>`: This object will allow the instance to emit events to the rest of the framework, as well as listen in for other events if necessary. See the documentation for further information.
 - `<testClassInstance>`: The test instance to be called.
 - `<object> runnerOptions`: The initial configuration options for this runner instance.
 - `<string> instanceId`: This is the name of this runner instance. This may be used to later by the system to filter

### Available properties
- `this.globalEventPool`
- `this.testClassInstance`
- `this.options`
- `this.instanceId`

### Methods to overwrite
#### start()
function called when the test runner should _start scheduling_ tests. It may not have to run a test straight away.

#### stop()
function called when the test runner should _stop scheduling_ tests. Any future tests should be stopped until this class is called to `start()` again.

### Handling Tests
Whenever a runner runs a test it is expected to event an emit to the `globalEventPool`, via the `emitTestEvent()` method.  
Note that the method signature includes a "runnerData" argument, which is an object containing data relevant to the running of the test, such as why it was run, what rules triggered it, runnerInstance name, etc.
It is suggested that __all__ runnerData objects contain 2 properties: `startTime` and `endTime`, which should be `Date` objects denoting when the test run began and when a conclusion was reached.
