const request = require('supertest');
const app = require('../index'); // Assuming your app is exported from index.js

describe('API Tests', () => {
    beforeAll(async () => {
        await myDB.sync({ force: false });
    });

    test('Test de base pour vérifier Jest', () => {
        expect(1 + 1).toBe(2);
    });

    test('GET / - Should return the index.html file', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.type).toBe('text/html');
    });

    test('GET /jeu - Should return the jeu.html file', async () => {
        const response = await request(app).get('/jeu');
        expect(response.status).toBe(200);
        expect(response.type).toBe('text/html');
    });

    test('GET /movies-actors/movies - Should return a paginated list of movies', async () => {
        const response = await request(app).get('/movies-actors/movies?page=1&limit=5');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('page', 1);
        expect(response.body).toHaveProperty('limit', 5);
    });

    test('GET /movies-actors/movie-title/:movieId - Should return the title of a movie', async () => {
        const movieId = 1; // Replace with a valid movie ID from your database
        const response = await request(app).get(`/movies-actors/movie-title/${movieId}`);
        if (response.status === 200) {
            expect(response.body).toHaveProperty('title');
        } else {
            expect(response.status).toBe(404);
        }
    });

    test('GET /movies-actors/actors/:movieId - Should return a list of actor IDs for a movie', async () => {
        const movieId = 1; // Replace with a valid movie ID from your database
        const response = await request(app).get(`/movies-actors/actors/${movieId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });

    test('GET /movies-actors/actor-name/:actorId - Should return the name of an actor', async () => {
        const actorId = 1; // Replace with a valid actor ID from your database
        const response = await request(app).get(`/movies-actors/actor-name/${actorId}`);
        if (response.status === 200) {
            expect(response.body).toHaveProperty('name');
        } else {
            expect(response.status).toBe(404);
        }
    });

    test('GET /movies-actors/movie-actors/:movieId - Should return detailed actor information for a movie', async () => {
        const movieId = 1; // Replace with a valid movie ID from your database
        const response = await request(app).get(`/movies-actors/movie-actors/${movieId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});
