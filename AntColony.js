import Ant from "./Ant.js";

class AntColony {
  ants = [];

  constructor(graph, pheromoneMatrix, antsNumber, alpha, beta) {
    this.graph = graph;
    this.pheromoneMatrix = pheromoneMatrix;
    this.alpha = alpha;
    this.beta = beta;
    this.generateAnts(antsNumber);
  }

  generateAnts(antsNumber) {
    for (let i = 0; i < antsNumber; i++) {
      const randomCityIdx = Math.floor(Math.random() * this.graph.cities.length);
      const ant = new Ant(this.graph, this.pheromoneMatrix, this.graph.cities[randomCityIdx], this.alpha, this.beta);
      this.ants.push(ant);
    }
  }

  makeTrip() {
    const tripResults = [];

    for (const ant of this.ants) {
      tripResults.push(ant.makeTrip());
    }

    return tripResults;
  }
}

export default AntColony;