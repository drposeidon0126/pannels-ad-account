const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
// const { validationResult } = require("express-validator");
const { validationResult } = require("express-validator");
// import formData from 'form-data';
const formData = require("form-data");

// Load input validation
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../validation/auth");

// Load User model
const Balance = require("../../models/Balance");

router.post("/create/", async (req, res) => {
  const { accountId, accountName, total, paymentCode, userId } = req.body;

  try {
    //   // Find the latest account
    const latestBalance = await Balance.findOne().sort({ invoiceId: -1 });

    // Determine the new ID
    const newId = latestBalance ? latestBalance.invoiceId + 1 : 5400;

    // Create a new account with the determined ID
    const balances = new Balance({
      invoiceId: newId,
      accountId: accountId,
      accountName: accountName,
      total: total,
      user: userId,
      paymentCode: paymentCode,
    });

    // Save the new account to the database
    await balances.save();

    return res.json({
      success: true,
      balances: balances,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  const { q } = req.query; // Get the search query parameter

  try {
    // Create a search condition
    const searchCondition = q ? { name: new RegExp(q, "i") } : {};

    // Find accounts matching the search condition
    const balances = await Balance.find(searchCondition).populate('user');;

    return res.json({
      balances: balances,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from URL params
  const { q } = req.query; // Get the search query parameter

  try {
    let query = { user: userId };

    // If search query is provided, add it to the query
    if (q) {
      query.name = new RegExp(q, "i");
    }

    const balances = await Balance.find(query);

    return res.json({
      balances: balances,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/delete/:id",  async (req, res) => {
  try {
    await Balance.findOneAndDelete({ _id: req.params.id });
    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



router.put("/update", async (req, res) => {
  const { _id, total, invoiceId, status, accountId, accountName,  paymentCode} = req.body;
  try {
    let balance = await Balance.findById(_id);
    if (balance) {
      balance.total = total;
      balance.invoiceId = invoiceId;
      balance.status = status;
      balance.accountId = accountId;
      balance.accountName = accountName;
      balance.paymentCode = paymentCode;
      await balance.save();
    }
    return res.json({
      success: true,
      balance: balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//send email
router.post("/sendEmail", auth, async (req, res) => {
  const client = mailgun.client({
    username: "api",
    key: "e9b6048b2297fb019b2f6c4d492aff36-28e9457d-ee1210e1",
  });
  const messageData = {
    from: req.body.from,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
  };
  client.messages
    .create("sandboxa212c18a6f5b45ad96fb1d9819faccdc.mailgun.org", messageData)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
