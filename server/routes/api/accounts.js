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
const Account = require("../../models/Account");
const User = require("../../models/User");

router.post("/create/", async (req, res) => {
    const { name, currency, link, platform, timezone, userId, bmId, facebookOne, facebookTwo} = req.body;
  
    try {
      // Find the latest account
      const latestAccount = await Account.findOne().sort({ id: -1 });
  
      // Determine the new ID
      const newId = latestAccount ? latestAccount.id + 1 : 4000;
  
      // Create a new account with the determined ID
      const account = new Account({
        id: newId,
        bmId: bmId,
        name: name,
        currency: currency,
        link: link,
        platform: platform,
        timezone: timezone,
        user: userId,
        facebookOne: facebookOne,
        facebookTwo: facebookTwo,
      });
  
      // Save the new account to the database
      await account.save();
  
      return res.json({
        success: true,
        account: account
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

router.get("/",  async (req, res) => {
    const { q } = req.query; // Get the search query parameter

    try {
      // Create a search condition
      const searchCondition = q ? { name: new RegExp(q, 'i') } : {};
  
      // Find accounts matching the search condition
      const accounts = await Account.find(searchCondition).populate('user');
  
      return res.json({
        accounts: accounts
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});

router.get("/:id", async (req, res) => {
    const userId = req.params.id; // Get the user ID from URL params
    const { q } = req.query; // Get the search query parameter
  
    try {
      let query = { user: userId };
  
      // If search query is provided, add it to the query
      if (q) {
        query.name = new RegExp(q, 'i');
      }
  
      const accounts = await Account.find(query);
  
      return res.json({
        accounts: accounts
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
})

router.delete("/delete/:id",  async (req, res) => {
  try {
    await Account.findOneAndDelete({ _id: req.params.id });
    res.json({
      state: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id/user", auth, async (req, res) => {
  try {
    const response = await User.findById(req.params.id);
    res.json({
      state: true,
      user: response,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/update", async (req, res) => {
  const { _id, name, currency, status, bmId,  platform, timezone, link, facebookOne, facebookTwo} = req.body;
  try {
    let account = await Account.findById(_id);
    if (account) {
      account.name = name;
      account.currency = currency;
      account.status = status;
      account.bmId = bmId;
      account.platform = platform;
      account.timezone = timezone;
      account.link = link;
      account.facebookOne = facebookOne;
      account.facebookTwo = facebookTwo;
     
      await account.save();
    }
    return res.json({
      success: true,
      account: account,
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
