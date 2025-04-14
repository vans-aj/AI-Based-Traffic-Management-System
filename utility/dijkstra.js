function dijkstra(graph, startNode) {
    const distances = {};
    const visited = new Set();
    const queue = [];

    for (let node in graph) {
        distances[node] = Infinity;
    }
    distances[startNode] = 0;
    queue.push([startNode, 0]);

    while (queue.length > 0) {
        queue.sort((a, b) => a[1] - b[1]);
        const [currentNode, currentDistance] = queue.shift();

        if (visited.has(currentNode)) continue;
        visited.add(currentNode);

        for (let neighbor in graph[currentNode]) {
            let newDist = currentDistance + graph[currentNode][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                queue.push([neighbor, newDist]);
            }
        }
    }

    return distances;
}

module.exports = dijkstra;