import config from "./config.js";
import PheromoneMatrix from "./PheromoneMatrix.js";
import AntColony from "./AntColony.js";

class ACOAlgorithm {
  shortest_path = [];
  shortest_distance = Infinity;
  iterations = 0;
  isFinished = false;
  iterationsWithoutChange = 0;

  constructor(graph) {
    this.graph = graph;
    const antsNumber = graph.cities.length;
    const DEFAULT_PHEROMONE_PER_ANT = config.DEFAULT_PHEROMONE / antsNumber;
  
    this.pheromoneMatrix = new PheromoneMatrix(graph, DEFAULT_PHEROMONE_PER_ANT, config.PHEROMONE_DEPOSIT, config.EVAPORATION_RATE);
    this.antColony = new AntColony(graph, this.pheromoneMatrix, antsNumber, config.ALPHA, config.BETA);
  }

  checkIsFinished() {
    this.isFinished = this.iterationsWithoutChange >= config.ITERATIONS_WITHOUT_CHANGE_LIMIT;
  }

  iterate() {
    this.checkIsFinished();

    if (this.isFinished) return;

    const tripResults = this.antColony.makeTrip();
    let isSomethingChanged = false;

    for (const result of tripResults) {
      if (result.distance < this.shortest_distance) {
        this.shortest_distance = result.distance;
        this.shortest_path = result.path;

        isSomethingChanged = true;
      } 
    }

    this.pheromoneMatrix.updatePheromone(tripResults);
    this.iterations++;

    if (isSomethingChanged) {
      this.iterationsWithoutChange = 0
    } else {
      this.iterationsWithoutChange++
    }
  }
}

export default ACOAlgorithm;