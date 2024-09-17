export default {
  ITERATIONS_WITHOUT_CHANGE_LIMIT: 20, // Multiplied by the number of cities 
  ALPHA: 1,
  BETA: 3,
  // ANTS_NUMBER: 10, // Optional. If omitted, will be equal to the number of cities
  INITIAL_PHEROMONE: 10, // Will be divided evenly between the ants
  PHEROMONE_DEPOSIT: 10,
  EVAPORATION_RATE: 0.1
}