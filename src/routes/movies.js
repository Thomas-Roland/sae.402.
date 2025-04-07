const { myDB, Movie, MoviesActors } = require("./models");






// Fonction pour récupérer les noms des films à partir de leurs IDs
async function getMovieNamesByIds(movieIds) {
  try {
    await myDB.authenticate();

    const movies = await Movie.findAll({
      where: {
        id: movieIds,
      },
      attributes: ["id", "title"], 
    });

    
    // Retourner les résultats sous forme d'objet { id: title }
    return movies.reduce((result, movie) => {
      result[movie.id] = movie.title;
      return result;
    }, {});
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    throw error;
  }
}







// Fonction pour afficher les noms des films à la place des IDs
async function displayMoviesWithActors() {
    try {
      const moviesActors = await MoviesActors.findAll();
  
      console.log("MoviesActors entries:", moviesActors);
  
      const movieIds = [...new Set(moviesActors.map((entry) => entry.id_movie))];
      console.log("Movie IDs:", movieIds);
  
      const movieNames = await getMovieNamesByIds(movieIds);
      console.log("Résultat de getMovieNamesByIds:", movieNames);
  
      moviesActors.forEach((entry) => {
        console.log(`Film: ${movieNames[entry.id_movie] || "Nom introuvable"}, Actor ID: ${entry.id_actor}`);
      });
    } catch (error) {
      console.error("Erreur lors de l'affichage des films et acteurs :", error);
    }
  }





displayMoviesWithActors();

module.exports = { getMovieNamesByIds, displayMoviesWithActors };