import supertest from 'supertest';
import app from "../app.js";
import movies from '../movies.json' assert { type: "json" };

const request = supertest(app);

describe("Test the endpoints result and status", () => {
    it("should return status 200 for Movies list page", async () => {
      const response = await request.get("/movies")
      expect(response.status).toEqual(200);
    });
    it("should return status 400 if invalid movie data entered", async () => {
      const movieData = {'name': "abc"}
      const response = await request.post("/movies").send(movieData)
      expect(response.status).toEqual(400);
    });
    it("should return status 201 if movie successfully added", async () => {
        const movie = {
            "title": "test movie",
            "director": "Hunny",
            "release_date": "today"
        }
        const response = await request.post("/movies").send(movie);
        expect(response.statusCode).toEqual(201);
    });
    it("should return status 403 if movie already exists", async () => {
        const movie = {
            "id": "456",
            "title": "The Irishman",
            "director": "Martin Scoresese",
            "release_date": "2019-09-27"
        }
        const response = await request.post("/movies").send(movie);
        expect(response.statusCode).toEqual(403);
    });
    it("should return status 200 if movie read successfully", async () => {
        const movie =     {
            "id": "456",
            "title": "The Irishman",
            "director": "Martin Scoresese",
            "release_date": "2019-09-27"
        }
        const response = await request.get("/movies").send(movie);
        expect(response.statusCode).toEqual(200);
    });
    it("should return status 404 when movie doesn't exist while deleting", async () => {
      const movieData = {
        "id": "1111",
        "title": "Inception",
        "director": "Nolan",
        "release_date": "08-12-1986"
      }
      const response = await request.delete("/movies/1111").send(movieData);
      expect(response.status).toEqual(404);
    });
  });