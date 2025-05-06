function dijkstra(graph, start) {
    const distances = {};
    const previous = {};
    const visited = {};
    const priorityQueue = [];

    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;
    priorityQueue.push({ node: start, distance: 0 });

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { node: current } = priorityQueue.shift();
        if (visited[current]) continue;
        visited[current] = true;

        for (const neighbor in graph[current]) {
            const newDist = distances[current] + graph[current][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = current;
                priorityQueue.push({ node: neighbor, distance: newDist });
            }
        }
    }

    const paths = {};
    for (const dest in distances) {
        const path = [];
        let curr = dest;
        while (curr) {
            path.unshift(curr);
            curr = previous[curr];
        }
        paths[dest] = path;
    }

    return { distances, paths };
}

module.exports = dijkstra;