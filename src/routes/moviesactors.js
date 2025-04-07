const express = require("express");
const { Actor, Movie } = require("../sgbd/models"); 
const router = express.Router();







// Route pour récupérer le prochain film
router.get("/next", async (req, res) => {
  try {
    const movie = await Movie.findOne(); 
    if (!movie) {
      return res.status(404).json({ message: "Aucun film trouvé" });
    }
    res.json({ data: movie });
  } catch (error) {
    console.error("Erreur lors de la récupération du film :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});






// Route pour récupérer les acteurs liés à un film
router.get("/actors/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findByPk(movieId, {
      include: {
        model: Actor,
        through: { attributes: [] }, 
      },
    });

    if (!movie) {
      return res.status(404).json({ message: "Film non trouvé" });
    }

    res.json({ data: movie.Actors });
  } catch (error) {
    console.error("Erreur lors de la récupération des acteurs :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});







// Route pour récupérer les films liés à un acteur
router.get("/actors/:actorId/movies", async (req, res) => {
  try {
    const { actorId } = req.params;
    const actor = await Actor.findByPk(actorId, {
      include: {
        model: Movie,
        through: { attributes: [] }, 
      },
    });

    if (!actor) {
      return res.status(404).json({ message: "Acteur non trouvé" });
    }

    res.json({ data: actor.Movies });
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});







module.exports = router;