import math
import random

# Algorithm inputs
ITERATIONS = 1000
ANTS_NUMBER = 4
EVAPORATION_RATE = 0.3
ALPHA = 1
BETA = 1
INITIAL_PHEROMONE = 1
Q = 10  # Costant that is divided by path distance and added to pheromone value for every edge of the path
CITIES = ["A", "B", "C", "D"]
DISTANCES = [
    #  A   B  C   D
    [0, 10, 15, 20],  # A
    [10, 0, 35, 25],  # B
    [15, 35, 0, 30],  # C
    [20, 25, 30, 0],  # D
]

# Generate initial pheromone value for every edge
PHEROMONES = [[INITIAL_PHEROMONE for _ in CITIES] for _ in CITIES]


def choose_next_city(visited, current):
    desire_factors = []

    for city_idx in range(len(CITIES)):
        if city_idx == current or city_idx in visited:
            desire_factors.append(0)
        else:
            distance = DISTANCES[current][city_idx]
            pheromone = PHEROMONES[current][city_idx]
            desire_factors.append(
                math.pow(pheromone, ALPHA) * math.pow(1 / distance, BETA)
            )

    # Generate random number in order to choose a city based on desire factor
    random_num = random.uniform(0, sum(desire_factors))

    for city_idx in range(len(CITIES)):
        if random_num < desire_factors[city_idx]:
            return city_idx
        else:
            random_num -= desire_factors[city_idx]

    raise Exception("ERROR: Next city cannot be calculated")


def update_pheromones(iteration_result):
    for row in range(len(PHEROMONES)):
        for col in range(len(PHEROMONES[0])):
            PHEROMONES[row][col] *= 1 - EVAPORATION_RATE

    for path, path_distance in iteration_result:
        pheromone_amount = Q / path_distance

        for idx in range(len(path) - 1):
            _from = path[idx]
            _to = path[idx + 1]
            PHEROMONES[_from][_to] += pheromone_amount
            PHEROMONES[_to][_from] += pheromone_amount  # graph is symmetric


def run_iteration():
    result = []

    for _ in range(ANTS_NUMBER):
        current_city_idx = random.randint(0, 3)
        path = [current_city_idx]
        path_distance = 0

        while len(path) < len(CITIES):
            next_city_idx = choose_next_city(path, current_city_idx)
            path_distance += DISTANCES[current_city_idx][next_city_idx]
            path.append(next_city_idx)
            current_city_idx = next_city_idx

        # Add starting point to the total distance and path list to close the path
        path_distance += DISTANCES[current_city_idx][path[0]]
        path.append(path[0])

        result.append((path, path_distance))

    update_pheromones(result)

    return result


def main():
    shortest_path = []
    shortest_distance = math.inf

    for _ in range(ITERATIONS):
        iteration_result = run_iteration()

        for path, path_distance in iteration_result:
            if path_distance < shortest_distance:
                shortest_distance = path_distance
                shortest_path = path

    return (shortest_path, shortest_distance)


if __name__ == "__main__":
    shortest_path, shortest_distance = main()
    print("SHORTEST PATH:", [CITIES[city_idx] for city_idx in shortest_path])
    print("SHORTEST PATH DISTANCE:", shortest_distance)
