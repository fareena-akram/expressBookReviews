const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    book => book.author.toLowerCase() === authorName.toLowerCase()
);

if (booksByAuthor.length > 0) {
    res.status(200).json({ books: booksByAuthor });
} else {
    res.status(404).json({ message: `No books found by author "${authorName}".` });
}
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bookTitle = req.params.title;
  const booksByTitle = Object.values(books).filter(
    book => book.title.toLowerCase() === bookTitle.toLowerCase()
);

if (booksByTitle.length > 0) {
    res.status(200).json({ books: booksByTitle });
} else {
    res.status(404).json({ message: `No books found by title "${bookTitle}".` });
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const booksByReview = Object.values(books).filter(
    book => book.isbn=== isbn
);
const reviews= booksByReview.flatMap(book=> book.reviews? book[reviews]: [])
if (reviews &&  books[isbn]) {
    res.status(200).json({ reviews });
} else {
    res.status(404).json({ message: `No reviews found by isbn "${isbn}".` });
}
});

module.exports.general = public_users;
