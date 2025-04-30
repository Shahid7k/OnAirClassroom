const express = require("express");
const router = express.Router();
const authQueries = require("../queries/auth");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const auth = require("../middleware/auth");

//ROUTE: POST api/auth
//DESCRIPTION: Authenticate a User and get the token
//Public
//Tarun: Add server side validation
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Check if the user exists
    let user = await authQueries.getUserByField("email", email);

    //If user does not exist
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    //If passwords do not match
    if (password != user.password) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token }); //Sending the token back
    });
    // //Testing
    // res.send("User Registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//ROUTE: GET api/auth
//DESCRIPTION: Get authenticated user details
//Authenticated
router.get("/", auth, async (req, res) => {
  try {
    let user = await authQueries.getUserByField("id", req.user.id);
	delete user.password;
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
