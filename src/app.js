const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateResource(request, response, next) {
  const { id } = request.params;

  repoIndex = repositories.findIndex((repository) => repository.id === id);

  if (repoIndex < 0) {
    return response.status(400).json("bad request!");
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;
  const repo = { id: uuid(), title, url, techs, likes };

  repositories.push(repo);

  return response.status(201).json(repo);
});

app.put("/repositories/:id", validateResource, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  let repo = repositories[repoIndex];
  repo = { id, title, url, techs, likes: repo.likes };

  repositories[repoIndex] = repo;

  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", validateResource, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateResource, (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  const repo = repositories[repoIndex];
  repo.likes += 1;
  repositories[repoIndex] = repo;
  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
