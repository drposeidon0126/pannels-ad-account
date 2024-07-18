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

const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

// Load input validation
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../validation/auth");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
// router.post("/", async (req, res) => {
//   //const { name, email, password } = req.body;

//   const { username, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ email: "User already exists" });
//     }
//     let state = "In-Active";
//     user = new User({
//       username,
//       email,
//       password,
//     });

//     //if (email === 'superadmin@playestates.com') user.user_status = 'Active';

//     const salt = await bcrypt.genSalt(10);

//     user.password = await bcrypt.hash(password, salt);

//     await user.save();
//     const payload = {
//       user: {
//         _id: user._id,
//         username: user.name,
//         email: user.email,
//         password: user.password,
//         role: user.role,
//       },
//     };
//     console.log(config.get("secretOrKey"));
//     jwt.sign(
//       payload,
//       config.get("secretOrKey"),
//       { expiresIn: 360000 },
//       (err, token) => {
//         if (err) throw err;
//         return res.json({
//           success: true,
//           access_token: "Bearer " + token,
//           refresh_token: "Bearer " + token,
//           user: {
//             _id: user._id,
//             username: user.name,
//             email: user.email,
//             password: user.password,
//             role: user.role,
//           },
//         });
//       }
//     );
//   } catch (err) {
//     if (err.message) {
//       res.status(500).send("Server error");
//     } else {
//       res.status(500).send(err.message);
//     }
//   }
// });
router.post("/", async (req, res) => {
  //const { name, email, password } = req.body;
  const {
    username,
    email,
    password,
    role,
    phonenumber,
    companyanme,
    country,
    monthlyadspend,
    goals,
    adplatformt,
  } = req.body.data;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ email: "User already exists" });
    }
    let state = "In-Active";
    user = new User({
      username,
      email,
      password,
      role,
      phonenumber,
      companyanme,
      country,
      monthlyadspend,
      goals,
      adplatformt,
    });

    //if (email === 'superadmin@playestates.com') user.user_status = 'Active';

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const payload = {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        phonenumber: user.phonenumber,
        companyanme: user.companyanme,
        country: user.country,
        monthlyadspend: user.monthlyadspend,
        goals: user.goals,
        adplatformt: user.adplatformt,
      },
    };
    console.log(config.get("secretOrKey"));
    jwt.sign(
      payload,
      config.get("secretOrKey"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({
          success: true,
          access_token: "Bearer " + token,
          refresh_token: "Bearer " + token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            phonenumber: user.phonenumber,
            companyanme: user.companyanme,
            country: user.country,
            monthlyadspend: user.monthlyadspend,
            goals: user.goals || "",
            adplatformt: user.adplatformt,
          },
        });
      }
    );
  } catch (err) {
    if (err.message) {
      res.status(500).send("Server error");
      console.log(err);
    } else {
      res.status(500).send(err.message);
      console.log(err);
    }
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", validateLoginInput(), async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ auth: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ auth: "Invalid Credentials" });
    }

    const payload = {
      user: {
        _id: user._id,
        username: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      config.secretOrKey,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          accessToken: "Bearer " + token,
          user: {
            _id: user._id,
            username: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/users/current
// @desc     Get user by token
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    console.log(user);
    res.json({
      user: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/list", async (req, res) => {
  const { q } = req.query; // Get the search query parameter

  try {
    // Adjusted search condition to also filter out users with admin role
    const searchCondition = {
      ...(q
        ? { username: new RegExp(q, "i"), fullname: new RegExp(q, "i") }
        : {}),
      role: { $ne: "admin" }, // Assuming 'role' is a field in your User schema
    };

    // Find balances matching the search condition and populate the 'user' field
    const users = await User.find(searchCondition);

    return res.json({
      users: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id });
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


router.put("/", async (req, res) => {
  console.log(req.body.data, "data")
  const {
    _id,
    username,
    email,
    password,
    role,
    phonenumber,
    companyanme,
    country,
    monthlyadspend,
    goals,
    adplatformt,
  } = req.body.data;
  try {
    let user = await User.findById(_id);
    if (user) {
      user.username = username;
      user.email = email;
      user.password = password;
      user.role = role;
      user.phonenumber = phonenumber;
      user.companyanme = companyanme;
      user.country = country;
      user.monthlyadspend = monthlyadspend;
      user.goals = goals;
      user.adplatformt = adplatformt;

      await user.save();
      const payload = {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role,
          phonenumber: user.phonenumber,
          companyanme: user.companyanme,
          country: user.country,
          monthlyadspend: user.monthlyadspend,
          goals: user.goals,
          adplatformt: user.adplatformt,
        },
      };
      console.log(config.get("secretOrKey"));
      jwt.sign(
        payload,
        config.get("secretOrKey"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({
            success: true,
            access_token: "Bearer " + token,
            refresh_token: "Bearer " + token,
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              password: user.password,
              role: user.role,
              phonenumber: user.phonenumber,
              companyanme: user.companyanme,
              country: user.country,
              monthlyadspend: user.monthlyadspend,
              goals: user.goals || "",
              adplatformt: user.adplatformt,
            },
          });
        }
      );
    }
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
