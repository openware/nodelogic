// om namah shivay

// requires
const _ = require('lodash');

// module variables
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

// set up config from env's
environmentConfig.barong_url = process.env.BARONG_URL || 'http://localhost:3000/api/v2/management/users/get';
environmentConfig.jwt.expire_date = process.env.JWT_EXPIRE_DATE || 60;
environmentConfig.jwt.algorithm = process.env.JWT_ALGORITHM || 'RS256';
environmentConfig.jwt.private_key = process.env.JWT_PRIVATE_KEY;
environmentConfig.node_port = process.env.PORT || defaultConfig.node_port;

const finalConfig = _.merge(defaultConfig, environmentConfig);
// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;

// log global.gConfig
console.log(`global.gConfig: ${JSON.stringify(global.gConfig, undefined, global.gConfig.json_indentation)}`);
