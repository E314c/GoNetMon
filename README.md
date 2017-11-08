# Go Netmon!
_NetMon used NodeJs, it's super effective!_

Paralysed by over complicated network monitoring?
Worried about your network being Frozen?
Tried other items, but always seem to get Burned?

NetMon is here to quickly and easily perform some basic network monitoring services,
so you can get back to being the very best!


## Project Goals
- Tests
  - [x] Be able to `ping` servers to determine latency
    - [ ] ... and latency within expected bounds
  - [ ] Check that given hostnames can be resolved
    - [ ] ... and checked against expected IPs
- Test Runners
  - [x] Run test at timed intervals
  - [ ] Run at given times
  - [ ] Run when other test pass/fail
- Data Logging
  - [x] Print results to console
  - [ ] Be able to access/view historic results of tests
  - [ ] Be able to view real-time data.
  - [ ] Web app to display nice graphs.
  - [ ] graph image generation to local files
- Alerts
  - Rules
    - [ ] whenever a check fails
    - [ ] when check fails `X` times in a row
    - [ ] when check fails a given amount of times in a set time block (`X` failures in last `Y` tries)
    - [ ] when `goNetMon` functionality fails
  - Methods
    - [ ] Event log
    - [ ] Email
- Configuration
  - [x] configuration from file
- Plugins
  - [ ] allow plugin tests with custom test functionality
  - [ ] allow custom alert scripts
