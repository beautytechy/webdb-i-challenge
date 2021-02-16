const express = require("express");


// database access using knex
const knex = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {

  knex
    .select("*")
    .from("accounts")
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error getting the posts" });
    });
});

router.get("/:id", (req, res) => {
  // select * from posts where id = req.params.id
  knex
    .select("*")
    .from("accounts")
    // .where("id", "=", req.params.id)
    .where({ id: req.params.id })
    .first() // equivalent to posts[0]
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error getting the post" });
    });
});

router.post("/", (req, res) => {

  const accountData = req.body;

  knex("accounts")
    .insert(accountData, "id")
    .then(ids => {

      const id = ids[0];

      return knex("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
          res.status(201).json(account);
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error adding the account"
      });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  // validate the data
  knex("accounts")
    .where({ id }) // ALWAYS FILTER ON UPDATE (AND DELETE)
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} record(s) updated` });
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error updating the account"
      });
    });
});

router.delete("/:id", (req, res) => {
  knex("accounts")
    .where({ id: req.params.id }) // ALWAYS FILTER ON UPDATE (AND DELETE)
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) removed` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "Error removing the account"
      });
    });
});


module.exports = router;