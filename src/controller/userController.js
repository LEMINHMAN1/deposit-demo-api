const moment = require("moment");
const { ObjectID } = require("mongodb");
const daos = require("../model/daos");
const collection = require("../constant/collection");

exports.create = async (req, res) => {
  const user = req.user;
  const { _id, email } = user;
  const { itemName, startPrice, timeWindow } = req?.body;

  const data = {
    userId: _id,
    userEmail: email,
    itemName,
    startPrice,
    timeWindow,
    dueDate: moment().utc().add(timeWindow, "m").toDate(),
    timestamp: moment().utc().toDate(),
  };

  const coll = daos.collection(collection.BID);
  let completed = await coll.insert(data);
  return res.status(200).send(completed);
};

exports.get = async (req, res) => {
  const user = req.user;
  const { _id, email } = user;
  const coll = daos.collection(collection.USER);
  let data = await coll.find({ _id: ObjectID(_id) });
  const _data = data?.data[0];
  delete _data.password
  return res.status(200).send(_data);
};

exports.deposit = async (req, res) => {
  const user = req.user;
  const { _id, email } = user;

  const { amount } = req.body;
  const coll = daos.collection(collection.USER);

  let completed = await coll.update(
    { _id: ObjectID(_id) },
    { $inc: { balance: Number(amount) } }
  );
  return res.status(200).send(completed);
};
