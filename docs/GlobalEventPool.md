# globalEventPool
This is the central system through which test pass and failure events are channeled and broadcast.

## available Methods
### addTestEventListener(listenerFunction, listenerOptions, listenerId)
_listenerFunction_ [function](testInstanceId, passed, [runnerData], [testData])
The function to call when the rule is triggered  
It will receive:
  - the `instanceId` of the test who's event this is
  - a boolean indicating whether is passed or not
  - a data object from the Runner Instance
  - data from the Test Instance  
_listenerOptions_ [listensTo config]  
The configuration object for what to listen to. Should validate against the `/docs/dataschemas/listensTo_schema.json`
_listenerId_ [string]  
The id of the listener  

### emitTestEvent(testInstanceId, passed, [runnerData], [testData])
_testInstanceId_ [string]  
The testInstance for which you would like events.  
_passed_ [bool]  
whether the test passed.
You can also append any additional arguments for loggers to detect / use.  
_runnerData_ [object]  
An object of data returned from the runner containing more information about the test run, particularly it _should_ contain a `startTime` and `endTime` keys with `date` objects, representing when the test was started and when the result was found.  
_testData_ [object]  
An object of data returned from the test containing more information about the test run.  
