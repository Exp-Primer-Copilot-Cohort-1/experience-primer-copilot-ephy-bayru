// Create web server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;

// Connect to database
const connection = require("./config");
connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
});

// Use body parser to parse JSON body
app.use(bodyParser.json());

// Use body parser to parse JSON body
app.use(bodyParser.urlencoded({ extended: true }));

// GET: Get all comments
app.get("/comments", (req, res) => {
  connection.query("SELECT * FROM comments", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// POST: Add a comment
app.post("/comment", (req, res) => {
  const { username, comment } = req.body;
  connection.query(
    "INSERT INTO comments (username, comment) VALUES (?, ?)",
    [username, comment],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// DELETE: Delete a comment
app.delete("/comment/:id", (req, res) => {
  const idComment = req.params.id;
  connection.query(
    "DELETE FROM comments WHERE id = ?",
    [idComment],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// PUT: Update a comment
app.put("/comment/:id", (req, res) => {
  const idComment = req.params.id;
  const newComment = req.body.comment;
  connection.query(
    "UPDATE comments SET comment = ? WHERE id = ?",
    [newComment, idComment],
    (err, result) => {
      if (err) throw err;
      res.send(result);
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});