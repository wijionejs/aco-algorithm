const LINE_MIN_WIDTH = 0.3
const LINE_MAX_WIDTH = 6;

class Canvas {
  #root;
  #ctx;
  #graph;

  constructor(root, graph) {
    this.#root = root;
    this.#graph = graph;
    this.#ctx = root.getContext('2d');
  }

  #drawNode(x, y, label) {
    // Draw a circle
    this.#ctx.beginPath();
    this.#ctx.lineWidth = 3;
    this.#ctx.strokeStyle = "orange";
    this.#ctx.fillStyle = "#fff";
    this.#ctx.arc(x, y, 15, 0, Math.PI * 2);
    this.#ctx.stroke();
    this.#ctx.fill();

    // Add a label inside the circle
    this.#ctx.fillStyle = "#000";
    this.#ctx.font = "14px Arial";
    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "middle";
    this.#ctx.fillText(label, x, y);
  }

  #drawEdge(x1, y1, x2, y2, distance, pheromone, lineWidth, isShortest = false) {
    // Draw a line
    this.#ctx.beginPath();
    this.#ctx.moveTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.strokeStyle = isShortest ? "orange" : "#000";
    this.#ctx.lineWidth = lineWidth; 
    this.#ctx.stroke();

    // Add a label above the line
    this.#ctx.font = "12px Arial";
    this.#ctx.textAling = "center";
    this.#ctx.textBaseline = "middle";
    this.#ctx.fillStyle = "#000";
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    this.#ctx.fillText(`${Math.round(distance)} (${pheromone.toFixed(2)})`, midX, midY - 5);
  }

  redrawGraph(pheromoneMatrix, shortestPath = []) {
    this.#ctx.clearRect(0, 0, this.#root.width, this.#root.height);


    const allPheromoneValues = Object.values(pheromoneMatrix?.matrix || {});
    const minValue = Math.min(...allPheromoneValues);
    const maxValue = Math.max(...allPheromoneValues);

    const { cities } = this.#graph;
  
    // Draw all edges
    for (let i = 0; i < cities.length - 1; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const fromCity = cities[i];
        const toCity = cities[j];
        const distance = this.#graph.getDistance(fromCity, toCity);
        const pheromone = pheromoneMatrix?.getPheromone(fromCity, toCity) || 1;
        const lineWidth = pheromoneMatrix?.matrix ? this.calculateLineWidth(minValue, maxValue, pheromone) : LINE_MIN_WIDTH;

        this.#drawEdge(fromCity.x, fromCity.y, toCity.x, toCity.y, distance, pheromone, lineWidth);
      }
    }

      // Highlight the shortest path on top of the graph edges
      for (let i = 0; i < shortestPath.length - 1; i++) {
      const city = shortestPath[i];
      const nextCity = shortestPath[i + 1];
      const distance = this.#graph.getDistance(city, nextCity);
      const pheromone = pheromoneMatrix?.getPheromone(city, nextCity) || 1;
      const lineWidth = pheromoneMatrix?.matrix ? this.calculateLineWidth(minValue, maxValue, pheromone) : LINE_MIN_WIDTH;

      this.#drawEdge(city.x, city.y, nextCity.x, nextCity.y, distance, pheromone, lineWidth, true);
    }
  
    // Draw cities 
    cities.forEach(city => {
      this.#drawNode(city.x, city.y, city.id);
    });
  }

  calculateLineWidth(minValue, maxValue, pheromoneValue) {
    return LINE_MIN_WIDTH + ((pheromoneValue - minValue) / (maxValue - minValue)) * (LINE_MAX_WIDTH - LINE_MIN_WIDTH);
  }
}

export default Canvas;