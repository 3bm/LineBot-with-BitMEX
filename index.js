const express = require('express');
const mongoose = require('mongoose');
const InitializeDatabase = require('./dbs');
const utility = require('./LineBot/Utility');
const app = express();

/**
 * Schema
 */
var Schema = mongoose.Schema;

// User
var userSchema = new Schema({
  lineUserId: { type: String, required: true, unique: true },
  apikey: { type: String },
  secret: { type: String },
  status: { type: Number, default: 0 },
  bound: { type: Number, default: 5.0 },
});
var User = mongoose.model('User', userSchema);

// Group
var groupSchema = new Schema({
  groupLineId: { type: String, required: true, unique: true },
  rekt: { type: Boolean, required: true, default: false },
});
var Group = mongoose.model('Group', groupSchema);


InitializeDatabase(async function (dbs) {

  global.userPool = []; // 初始化userPool
  global.groupPool = []; // 初始化userPool

  /**
   * Load data from database
   */
  let users = await User.find({}, {
    '_id': 0,
    'lineUserId': 1,
    'apikey': 1,
    'secret': 1,
    'status': 1,
  }).exec();

  let groups = await Group.find({}, {
    '_id': 0,
    'groupLineId': 1,
    'rekt': 1,
  }).exec();

  const UserModel = require('./Model/User'),
    GroupModel = require('./Model/Group'); // 與Schema名稱重複
  // 將資料物件化送進pool
  users.map((user) => {
    global.userPool.push(new UserModel(user.lineUserId, user.apikey, user.secret, user.status, user.bound));
  });
  groups.map((group) => {
    global.groupPool.push(new GroupModel(group.groupLineId, group.rekt));
  });
  console.log(`[SYS] 已載入${users.length}個Users,已載入${groups.length}個Groups`);

  /**
   * Save data to database 
   */
  process.on('SIGINT', save);
  process.on('SIGTERM', save);

  async function save() {
    console.log('Saving...');
    try {
      // Save User
      for (var i in userPool) {

        let user = userPool[i];
        // user exist?
        let count = await User.count({ lineUserId: user.lineUserId }).exec();
        if (count == 0) {
          // not exist, create a user
          await new User({
            lineUserId: user.lineUserId,
            apikey: user.apikey,
            secret: user.secret,
            status: user.status,
            bound: user.bound,
          }).save();
        } else {
          // exist, update it
          await User.findOneAndUpdate(
            { lineUserId: user.lineUserId },
            {
              $set: {
                apikey: user.apikey,
                secret: user.secret,
                status: user.status,
                bound: user.bound,
              }
            }).exec();
        }
      }

      // Save Group
      for (var j in groupPool) {

        let group = groupPool[j];
        // user exist?
        let count = await Group.count({ groupLineId: group.groupLineId }).exec();
        if (count == 0) {
          // not exist, create a group
          await new Group({
            groupLineId: group.groupLineId,
            rekt: group.rekt,
          }).save();
        } else {
          // exist, update it
          await Group.findOneAndUpdate(
            { groupLineId: group.groupLineId, },
            {
              $set: {
                rekt: group.rekt
              }
            }).exec();
        }

      }

    } catch (e) {
      console.log(e);
    }

    utility.broadcast('BOT已關閉');
    await utility.delay(500); // 等待line訊息送出

    console.log('Done.');
    process.exit();
  }


  /**
   * 啟動服務
   */

  const linebotParser = require('./LineBot/').parser();
  app.post('/', linebotParser);

  // 因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

});
