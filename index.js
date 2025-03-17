const express = require('express'); // Error 1: Missing quotes around 'express'
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
let books = [];



app.get('/whoami', (request, response) => {
  response.json({studentnum: "2682400"});
});

app.get('/books', (request, response) => { // Error 2: 'respsonse' typo
  response.json(books);
});



app.get('/books/:id', (request, response) => { // Error 3: Missing slash before 'books'
  const book = books.find(book => book.id === request.params.id);
  if (!book) {
    return response.status(404).json({error: "Not found"});
  }
  response.json(book);
});





app.post('/books', (request, response) => {
  const {id, title, details} = request.body;
  if (!id || !title) {
    return response.status(400).json({error: "Bad request"});
  }
  
  let validDetails = true; // Error 4: Moved this variable outside the if block
  if (details) {
    validDetails = details.every(detail => 
      detail.id && detail.author && detail.genre && detail.publicationYear); // Error 5: 'publicationyear' -> 'publicationYear'
  
    if (!validDetails) {
      return response.status(400).json({error: "Bad request"});
    }
  }
  

  const newBook = {
    id,
    title,
    details: details || []
  };
  books.push(newBook); // Error 6: 'newbook' -> 'newBook'
  response.status(201).json(newBook);
});





app.put('/books/:id', (req, res) => {
  const { title, details } = req.body;
  const bookIndex = books.findIndex(book => book.id === req.params.id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Not found" });
  }
  if (title) {
    books[bookIndex].title = title;
  }
  if (details) {
    const validDetails = details.every(detail =>
      detail.id && detail.author && detail.genre && detail.publicationYear
    );
    if (!validDetails) {
      return res.status(400).json({ error: "Bad request" });
    }
    books[bookIndex].details = details;
  }
  res.json(books[bookIndex]);
});





app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(book => book.id === req.params.id);
  if (bookIndex === -1) {
    return res.status(404).json({ error: "Not found" });
  }
  const deletedBook = books.splice(bookIndex, 1)[0];
  res.json(deletedBook);
});






app.post('/books/:id/details', (req, res) => {
  const { id, author, genre, publicationYear } = req.body;
  const book = books.find(book => book.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Not found" });
  }
  if (!id || !author || !genre || !publicationYear) {
    return res.status(400).json({ error: "Bad request" });
  }
  const newDetail = {
    id,
    author,
    genre,
    publicationYear
  };
  book.details.push(newDetail);
  res.status(201).json(book);
});






app.delete('/books/:id/details/:detailId', (req, res) => {
  const book = books.find(book => book.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Not found" });
  }
  const detailIndex = book.details.findIndex(detail => detail.id === req.params.detailId);
  if (detailIndex === -1) {
    return res.status(404).json({ error: "Not found" });
  }
  book.details.splice(detailIndex, 1);
  res.json(book);
});







app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
