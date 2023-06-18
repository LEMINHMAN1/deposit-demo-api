const winston = require("winston");
const lodash = require("lodash");
const DBConnectUtils = require("./../utils/DBConnectUtils");
const collection = require("./../constant/collection");

exports.collection = (name) => {
  const db = DBConnectUtils.getDB();
  let coll = null;
  switch (name) {
    case collection.USER:
      coll = db.collection(collection.USER);
      break;
    case collection.BID:
      coll = db.collection(collection.BID);
      break;
    case collection.EVENT_TYPE:
      coll = db.collection(collection.EVENT_TYPE);
      break;
    case collection.BOOKING:
      coll = db.collection(collection.BOOKING);
      break;
  }

  const find = async (condition) => {
    let data = null;
    let err = null;
    try {
      const result = await coll.find(condition);
      data = await result.toArray();
    } catch (e) {
      winston.error(err);
      err = e;
    }
    return {
      err,
      data,
    };
  };

  const update = async (condition, newValues) => {
    try {
      await coll.updateMany(condition, newValues);
      return true;
    } catch (err) {
      winston.error(err);
      return false;
    }
  };

  const insert = async (obj) => {
    try {
      await coll.insert(obj);
      return true;
    } catch (err) {
      winston.error(err);
      return false;
    }
  };

  const remove = async (condition) => {
    try {
      await coll.deleteOne(condition);
      return true;
    } catch (err) {
      winston.error(err);
      return false;
    }
  };

  return {
    find,
    update,
    insert,
    remove,
  };
};
