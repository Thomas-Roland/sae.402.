const { myDB, Actor, MoviesActors } = require("./models");
const { Sequelize, DataTypes, Op } = require("sequelize");

(async () => {
  try {
    console.log("Test de displayActorsWithMovies");
    await displayActorsWithMovies();
  } catch (error) {
    console.error("Erreur lors du test:", error);
  }
})();

async function getActorNamesByIds(actorIds) {
  try {
    console.log("IDs d'acteurs recherchés:", actorIds);
    const actors = await Actor.findAll({
      where: {
        id: {
          [Op.in]: actorIds
        }
      },
      attributes: ['id', 'name'],
    });
    console.log("Acteurs trouvés:", actors.length);
    console.log("Données des acteurs:", actors.map(a => ({ id: a.id, name: a.name })));
    




    return actors.reduce((result, actor) => {
      result[actor.id] = actor.name;
      return result;
    }, {});
  } catch (error) {
    console.error("Erreur lors de la récupération des acteurs :", error);
    throw error;
  }
}





// Fonction pour afficher les noms des acteurs à la place des IDs
async function displayActorsWithMovies() {
  try {
    const moviesActors = await MoviesActors.findAll({
      include: [
        {
          model: Actor, 
          attributes: ['name'], 
        },
      ],
    });

    moviesActors.forEach((entry) => {
      console.log(`Movie ID: ${entry.id_movie}, Acteur: ${entry.Actor.name}`);
    });
  } catch (error) {
    console.error("Erreur lors de l'affichage des acteurs avec les films :", error);
  }
}






// Fonction pour récupérer les acteurs d'un film spécifique
async function getActorsByMovieId(movieId) {
  try {
    const moviesActors = await MoviesActors.findAll({
      where: { id_movie: movieId },
      include: [
        {
          model: Actor, 
          attributes: ['name'], 
        },
      ],
    });




    // Extraire et retourner les noms des acteurs
    const actorNames = moviesActors.map((entry) => entry.Actor.name);
    console.log(`Acteurs trouvés pour le film ${movieId}:`, actorNames);
    return actorNames;
  } catch (error) {
    console.error(`Erreur lors de la récupération des acteurs pour le film ${movieId}:`, error);
    return [];
  }
}







async function getActorById(actorId) {
    try {
      const actor = await Actor.findByPk(actorId);
      return actor ? actor.name : null; 
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'acteur ${actorId}:`, error);
      return null;
    }
  }

// Appeler la fonction pour tester
// displayActorsWithMovies();

module.exports = { 
  getActorNamesByIds, 
  displayActorsWithMovies,
  getActorsByMovieId,
  getActorById
};