var mongoose = require('mongoose');
mongoose.Promise = Promise;  

var MONGO_URI = process.env.MONGODB_URI;

module.exports = async function init(cb) {
    try {
        var mongoDB = await mongoose.connect(
            MONGO_URI,
            {
                useMongoClient: true,
                autoReconnect: true
            }
        );

        console.log('已連線至DB');

        cb(mongoDB);
    } catch (e) {
        console.log(e);
    }
};