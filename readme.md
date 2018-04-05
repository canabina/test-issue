# To run
```sh
	$ git clone https://github.com/canabina/test-issue.git .
	$ npm i
	$ npm start
```
By default app run on **3007** port

## Config to redis
Can edititng in **config.js** file

## Example query 
http://localhost:3007/echoAtTime?time=1522949618&message=Hello_World

### Query params

time - (unixtime)(int) **required** - time to show message
message - (string) **required** - message which will be to show in console output

#### Required modules
* Lodash
* Express
* Redis
* Redis-notifier
* Moment
