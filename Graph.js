import City from "./City.js";

class Graph {
  cities = [];
  distances = {};

  addCity(x, y) {
    const id = this.cities.length + 1;
    this.cities.push(new City(id, x, y));
    this.recalculateDistances();
  }

  recalculateDistances() {
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = i; j < this.cities.length; j++) {
        const from = this.cities[i];
        const to = this.cities[j];
        const distance = this.calculateDistance(from.x, from.y, to.x, to.y);

        const edgeId = this.getEdgeId(from, to);
        const edgeIdInverse = this.getEdgeId(to, from);

        this.distances[edgeId] = this.distances[edgeIdInverse] = distance;
      }
    }
  }
  
  getEdgeId(cityA, cityB) {
    return `${cityA.id}:${cityB.id}`;
  }

  calculateDistance(x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
  }

  getDistance(cityA, cityB) {
    return this.distances[this.getEdgeId(cityA, cityB)];
  }
}

export default Graph;