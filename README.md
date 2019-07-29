# Node JS Applogic for Rubykube stack

### Start the app
To start up the application simply run
`npm run start`

### Configuration
All the config is stored inside `config/config.json` file or can be defined using env variables

### Testing
To verify that your Applogic is working with a Microkube installation you need to first create a session for user

You can do so by using `http` command line tool
To install *http* cli follow this [guide](https://httpie.org/#installation)

`http --session=new POST http://www.app.local/api/v2/barong/identity/sessions email='admin@barong.io' password='0lDHd9ufs9t@'`

After that you can check if applogic endpoint is working

`http --session=new POST http://www.app.local/api/v2/applogic/users/get email='john@barong.io'`

This endpoint returns a user taken from barong, the communication between applogic and barong is done using management api.
