const moment = require("moment");
const { ObjectID } = require("mongodb");
const daos = require("../model/daos");
const collection = require("../constant/collection");
const { isEmpty } = require("lodash");

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
  const { filterType } = req?.query;

  const coll = daos.collection(collection.BID);
  let data = {};
  if (filterType === "ongoing") {
    data = await coll.find({
      userEmail: email,
      dueDate: { $gte: moment().utc().toDate() },
    });
  } else if (filterType === "completed") {
    data = await coll.find({
      userEmail: email,
      dueDate: { $lt: moment().utc().toDate() },
    });
  } else if (filterType === "all") {
    data = await coll.find({});
  } else {
    return res
      .status(400)
      .send(`Filter Type can only be: ongoing, completed, all`);
  }
  return res.status(200).send(data?.data);
};

exports.bid = async (req, res) => {
  const user = req.user;
  const { _id, email } = user;
  const { amount, projectId } = req?.body;
  const coll = daos.collection(collection.BID);
  const userColl = daos.collection(collection.USER);

  const userInfo = await userColl.find({ _id: ObjectID(_id) });
  if (userInfo?.data) {
    const balance = userInfo.data[0].balance;
    const found = await coll.find({ _id: ObjectID(projectId) });
    if (!isEmpty(found.data)) {
      const highestPrice =
        found.data[0]?.currentPrice || found.data[0]?.startPrice;
      if (Number(amount) < highestPrice) {
        return res
          .status(400)
          .send("Min price must be: " + (Number(amount) + 1));
      } else if (Number(amount) > Number(balance)) {
        return res.status(400).send(`Your balance (${balance}$) isn't enough`);
      } else {

        // Refund money for bid user
        await userColl.update(
          { email: found.data[0].bidUser },
          { $inc: { balance: found.data[0]?.currentPrice} }
        );
        console.log("refund", found.data[0].bidUser )

        // Update bid info
        await coll.update(
          { _id: ObjectID(projectId) },
          { $set: { currentPrice: Number(amount), bidUser: email } }
        );

        // Charge
        await userColl.update(
          { _id: ObjectID(_id) },
          { $inc: { balance: -Number(amount) } }
        );
        console.log("chart", email )

        return res.status(200).send(true);
      }
    } else {
      return res.status(400).send("Data not found");
    }
  } else {
    return res.status(400).send("Data not found");
  }
};
