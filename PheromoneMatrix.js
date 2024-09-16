class PheromoneMatrix {
  matrix = {};

  constructor(graph, defaultPheromone, pheromoneDeposit, evaporationRate) {
    this.graph = graph;
    this.pheromoneDeposit = pheromoneDeposit;
    this.evaporationRate = evaporationRate;
    this.defaultPheromone = defaultPheromone;
    this.generateMatrix();
  }

  generateMatrix() {
    const { cities } = this.graph;
    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        const edgeId = this.graph.getEdgeId(cities[i], cities[j]);
        const edgeIdReverse = this.graph.getEdgeId(cities[j], cities[i]);
        this.matrix[edgeId] = this.matrix[edgeIdReverse] = this.defaultPheromone;
      }
    }
  }

  getPheromone(cityA, cityB) {
    return this.matrix[this.graph.getEdgeId(cityA, cityB)];
  }

  evaporate() {
    for (const edgeId in this.matrix) {
      this.matrix[edgeId] *= 1 - this.evaporationRate;
    }
  }

  updateEdge(cityA, cityB, amount) {
    const edgeId = this.graph.getEdgeId(cityA, cityB);
    const edgeIdReverse = this.graph.getEdgeId(cityB, cityA);
    this.matrix[edgeId] += amount;
    this.matrix[edgeIdReverse] += amount;
  }

  updatePheromone(tripResults) {
    this.evaporate();

    for (const tripResult of tripResults) {
      const { path, distance } = tripResult;
      const amount = this.pheromoneDeposit / distance;

      for (let i = 0; i < path.length - 1; i++) {
        this.updateEdge(path[i], path[i + 1], amount);
      }
    }
  }
}

export default PheromoneMatrix;
