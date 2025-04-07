require("dotenv").config();
const express = require("express");
const path = require("path");
const { myDB, MoviesActors, Movie, Actor } = require("./src/sgbd/models.js");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();
app.use(express.json());








// config Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Movies-Actors',
      version: '1.0.0',
      description: 'API pour gérer les films et les acteurs',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./index.js'], 
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);







// initialisation des fonction
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

myDB.sync({ force: false })
  .then(() => {
    console.log("✅ Base de données synchronisée.");
  })
  .catch((error) => {
    console.error("❌ Erreur lors de la synchronisation de la base de données :", error);
  });

app.use(express.static(path.join(__dirname, 'public')));







/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil
 *     description: Affiche la page d'accueil (index.html)
 *     responses:
 *       200:
 *         description: Fichier HTML de la page d'accueil
 */
// Route principale pour afficher le fichier index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});






/**
 * @swagger
 * /jeu:
 *   get:
 *     summary: Page de jeu
 *     description: Affiche la page de jeu (jeu.html)
 *     responses:
 *       200:
 *         description: Fichier HTML de la page de jeu
 */
// Route pour afficher le fichier jeu.html
app.get("/jeu", (req, res) => {
  res.sendFile(path.join(__dirname, "jeu.html"));
});







/**
 * @swagger
 * /movies-actors/movies:
 *   get:
 *     summary: Liste des films
 *     description: Récupère une liste paginée de films
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page à afficher
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des ID de films
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Liste des ID de films
 *                 page:
 *                   type: integer
 *                   description: Page actuelle
 *                 limit:
 *                   type: integer
 *                   description: Nombre d'éléments par page
 *       500:
 *         description: Erreur serveur
 */
// Route pour récupérer les films avec pagination
app.get("/movies-actors/movies", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query; 
    const offset = (page - 1) * limit;





    
    
    // recup les films uniques avec pagination
    const moviesActors = await MoviesActors.findAll({
      attributes: ["id_movie"],
      group: ["id_movie"],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    const movies = moviesActors.map((relation) => relation.id_movie);
    res.json({ data: movies, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});








/**
 * @swagger
 * /movies-actors/movie-title/{movieId}:
 *   get:
 *     summary: Titre d'un film
 *     description: Récupère le titre d'un film par son ID
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Titre du film
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Titre du film
 *       404:
 *         description: Film non trouvé
 *       500:
 *         description: Erreur serveur
 */
// Nouvelle route pour récupérer le titre d'un film
app.get("/movies-actors/movie-title/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findByPk(movieId);
    
    if (!movie) {
      return res.status(404).json({ message: "Film non trouvé" });
    }
    
    res.json({ title: movie.title });
  } catch (error) {
    console.error("Erreur lors de la récupération du titre du film :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});







/**
 * @swagger
 * /movies-actors/actors/{movieId}:
 *   get:
 *     summary: Acteurs d'un film
 *     description: Récupère les acteurs associés à un film
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Liste des ID d'acteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: Liste des ID d'acteurs
 *                 message:
 *                   type: string
 *                   description: Message d'information (optionnel)
 *       500:
 *         description: Erreur serveur
 */
// Route pour récupérer les acteurs liés à un film
app.get("/movies-actors/actors/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;






    
    // Récupérer les relations où id_movie correspond au movieId
    const actors = await MoviesActors.findAll({
      where: { id_movie: movieId },
    });
    
    if (actors.length === 0) {
      return res.json({ data: [], message: "Aucun acteur trouvé pour ce film." });
    }
    







    // Retourner uniquement les id_actor
    const actorIds = actors.map((relation) => relation.id_actor);
    res.json({ data: actorIds });
  } catch (error) {
    console.error("Erreur lors de la récupération des acteurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /movies-actors/actor-name/{actorId}:
 *   get:
 *     summary: Nom d'un acteur
 *     description: Récupère le nom d'un acteur par son ID
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'acteur
 *     responses:
 *       200:
 *         description: Nom de l'acteur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nom de l'acteur
 *       404:
 *         description: Acteur non trouvé
 *       500:
 *         description: Erreur serveur
 */











// Nouvelle route pour récupérer le nom d'un acteur
app.get("/movies-actors/actor-name/:actorId", async (req, res) => {
  try {
    const { actorId } = req.params;
    const actor = await Actor.findByPk(actorId);
    
    if (!actor) {
      return res.status(404).json({ message: "Acteur non trouvé" });
    }
    
    res.json({ name: actor.title }); 
  } catch (error) {
    console.error("Erreur lors de la récupération du nom de l'acteur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Suppression de la route dupliquée pour /movies-actors/actor-name/:actorId







/**
 * @swagger
 * /movies-actors/movie-actors/{movieId}:
 *   get:
 *     summary: Détails des acteurs d'un film
 *     description: Récupère tous les acteurs d'un film avec leurs détails
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Liste des acteurs avec leurs détails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       500:
 *         description: Erreur serveur
 */








// Route pour obtenir tous les acteurs d'un film
app.get('/movies-actors/movie-actors/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const actors = await getActorsByMovieId(movieId);
    
    res.json({ data: actors });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});






// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}.`);
  console.log(`📚 Documentation API disponible sur http://localhost:${PORT}/documentation`);
});