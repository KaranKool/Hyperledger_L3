/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require("fabric-shim");
const util = require("util");

var Chaincode = class {
  // Initialize the chaincode
  async Init() {
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.error("no method of name:" + ret.fcn + " found");
      return shim.error("no method of name:" + ret.fcn + " found");
    }

    console.info("\nCalling method : " + ret.fcn);
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }
  // create Trade
  async createTrade(stub, args) {
    console.info("============= START : Create Gadget ===========");
    if (args.length != 5) {
      throw new Error("Incorrect number of arguments. Expecting 5");
    }
    var tradeId = args[0];
    var fromParty = args[1];
    var toParty = args[2];
    var amount = args[3];
    var tradeDate = args[4];
    var status = "SUBMITTED";
    if (!tradeId || !fromParty || !toParty || !amount || !tradeDate) {
      throw new Error("arguments must not be empty");
    }
    const trade = {
      docType: "trade",
      fromParty,
      toParty,
      amount,
      tradeDate,
      status
    };

    await stub.putState(tradeId, Buffer.from(JSON.stringify(trade)));
    console.info("============= END : Create Gadget ===========");
  }

  // query callback representing the query all of a chaincode
  async queryAll(stub) {
    const iterator = await stub.getStateByRange("", "");

    const allResults = [];
    while (true) {
      const res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        console.log(res.value.value.toString("utf8"));

        const Key = res.value.key;
        let Record;
        try {
          Record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          console.log(err);
          Record = res.value.value.toString("utf8");
        }
        allResults.push({ Key, Record });
      }
      if (res.done) {
        console.log("end of data");
        await iterator.close();
        var result = JSON.stringify(allResults);
        return Buffer.from(result);
      }
    }
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error(
        "Incorrect number of arguments. Expecting tradeId of the trade to query"
      );
    }
    const tradeAsBytes = await stub.getState(args[0]); // get the trade from chaincode state
    if (!tradeAsBytes || tradeAsBytes.length === 0) {
      throw new Error(`${args[0]} does not exist`);
    }
    console.log(tradeAsBytes.toString());
    return Buffer.from(tradeAsBytes.toString());
  }
};

shim.start(new Chaincode());
