class Ant {
  constructor(graph, pheromoneMatrix, city, alpha, beta) {
    this.graph = graph;
    this.pheromoneMatrix = pheromoneMatrix;
    this.homeCity = city;
    this.alpha = alpha;
    this.beta = beta;
    this.currentCity = city;
    this.path = [city];
    this.distance = 0;
  }

  chooseNext() {
    let desireFactors = [];
    let sum = 0;

    for (let i = 0; i < this.graph.cities.length; i++) {
      const candidateCity = this.graph.cities[i];

      if (this.path.includes(candidateCity)) {
        desireFactors[i] = 0;
        continue;
      }

      const pheromoneAmountOnEdge = this.pheromoneMatrix.getPheromone(this.currentCity, candidateCity);
      const edgeDistance = this.graph.getDistance(this.currentCity, candidateCity);

      desireFactors[i] = Math.pow(pheromoneAmountOnEdge, this.alpha) * Math.pow(1 / edgeDistance, this.beta);
      sum += desireFactors[i];
    }

    let randomNumber = Math.random() * sum;

    for (let i = 0; i < desireFactors.length; i++) {
      if (randomNumber < desireFactors[i]) return this.graph.cities[i];

      randomNumber -= desireFactors[i];
    }

    throw new Error("Cannot find next city");
  }

  reset() {
    this.distance = 0;
    this.path = [this.homeCity];
    this.currentCity = this.homeCity;
  }

  makeTrip() {
    this.reset();

    while (this.path.length < this.graph.cities.length) {
      const nextCity = this.chooseNext();
      this.distance += this.graph.getDistance(this.currentCity, nextCity);

      this.path.push(nextCity);
      this.currentCity = nextCity;
    }

    // Return home
    this.path.push(this.homeCity);
    this.distance += this.graph.getDistance(this.currentCity, this.homeCity);

    return { path: this.path, distance: this.distance }
  }
}

export default Ant;