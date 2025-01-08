const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;
const fs = require("fs");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/movies", (req, res) => {
  const data = fs.readFileSync("./data/movies.json", "utf8");
  const movies = JSON.parse(data);
  res.json(movies);
});

// app.get("movies/create", (req, res) => {
//   res.json([
//     { id: 1, name: "Harry Potter" },
//     { id: 2, name: "Sonic 2" },
//   ]);
// });

app.post("/movies/create", (req, res) => {
  // 1. read json from file
  const data = fs.readFileSync("./data/movies.json", "utf8");
  const movies = JSON.parse(data);

  const body = req.body;

  // 2. push to json array
  movies.push({ id: Date.now(), ...body });

  //3. write json to file
  const moviesString = JSON.stringify(movies, null, 2);
  fs.writeFileSync("./data/movies.json", moviesString);

  res.json({ message: "Success" });
});

const findByID = (req, res) => {
  const movieID = req.params.id;

  const data = fs.readFileSync("./data/movies.json", "utf8");
  const movies = JSON.parse(data);

  const movie = movies.find((movie) => movie.id === Number(movieID));

  res.json(movie);
};

app.get("/movies/:id", findByID);

app.delete("/movies/:id", (req, res) => {
  const movieID = req.params.id;

  const data = fs.readFileSync("./data/movies.json", "utf8");
  const movies = JSON.parse(data);

  // Find the index of the movie to be deleted
  const movieIndex = movies.findIndex((movie) => movie.id === Number(movieID));

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  // Remove the movie from the array
  const deletedMovie = movies.splice(movieIndex, 1);

  // Write the updated movie list back to the file
  const moviesString = JSON.stringify(movies, null, 2);
  fs.writeFileSync("./data/movies.json", moviesString);

  // Return a response confirming the deletion
  res.json({
    message: "Movie deleted successfully",
    deletedMovie: deletedMovie[0],
  });
});

app.put("/movies/:id", (req, res) => {
  const movieID = req.params.id;

  const data = fs.readFileSync("./data/movies.json", "utf8");
  const movies = JSON.parse(data);

  const updatedData = req.body;

  // Find the index of the movie to be updated
  const movieIndex = movies.findIndex((movie) => movie.id === Number(movieID));

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const oldMovie = movies[movieIndex];
  // oldMovie.name = req.body.name;

  // Update the movie with the new data
  const updatedMovie = { ...oldMovie, ...updatedData }; // Merge old and new data
  movies[movieIndex] = updatedMovie;

  // Write the updated movie list back to the file
  const moviesString = JSON.stringify(movies, null, 2);
  fs.writeFileSync("./data/movies.json", moviesString);

  // Return a response confirming the deletion
  res.json({
    message: "Movie updated successfully",
    updatedMovie: updatedMovie,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
