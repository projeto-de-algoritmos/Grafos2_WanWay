let nodeParents = {};

export const findRouteBFS = (startLAN, endLAN, networkGraph) => {
  const queue = [];
  const visited = [];
  const startNODE = networkGraph[startLAN].router;
  nodeParents[startNODE] = startLAN;

  visited.push(startNODE);

  queue.push(networkGraph[startNODE]);

  while (queue.length > 0) {
    let visiting = queue.shift();

    if (visiting.connectedLAN.find((el) => endLAN === el) !== undefined) {
      nodeParents[endLAN] = visiting.id;
      return showPath(startLAN, endLAN, networkGraph);
    }

    visiting.connectedWAN.forEach((indexNeighbor) => {
      if (visited.find((el) => el === indexNeighbor) === undefined) {
        visited.push(indexNeighbor);
        queue.push(networkGraph[indexNeighbor]);
        nodeParents[indexNeighbor] = visiting.id;
        // console.log(`nodeParents: ${nodeParents}`)
        // console.log(`FILHO: ${networkGraph[indexNeighbor].name} [${indexNeighbor}] PAI: ${networkGraph[visiting.id].name} [${visiting.id}]`);
      }
    });
  }
};

export const findRouteDijkstra = (startLAN, endLAN, networkGraph) => {
  const startNODE = networkGraph[startLAN].router
  const endNODE = networkGraph[endLAN].router
  const costs = {}
  const processed = []

  costs[endNODE] = Infinity
  nodeParents[endNODE] = null

  nodeParents[endLAN] = endNODE;
  nodeParents[startNODE] = startLAN;
  costs[startNODE] = networkGraph[startNODE].latency + 1;

  let lowest = lowestCostNode(costs, processed);

  while (lowest) {
    let cost = costs[lowest];
    let children = networkGraph[lowest].connectedWAN;
    

    children.forEach(n => {
      let newCost = cost + networkGraph[n].latency + 1;

      if (!costs.hasOwnProperty(n) || costs[n] > newCost) {
        costs[n] = newCost;
        nodeParents[n] = lowest;
      }

    })
    processed.push(lowest);
    lowest = lowestCostNode(costs, processed);
  }

  return showPath(startLAN, endLAN, networkGraph);
}

const lowestCostNode = (costs, processed) => {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.includes(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
};

const showPath = (startLAN, endLAN, networkGraph) => {
  const path = [];
  let nodeParent = networkGraph[endLAN].id;
  
  while (nodeParent !== startLAN) {
    // console.log(networkGraph[nodeParent].name)
    path.unshift(networkGraph[nodeParent].name);
    nodeParent = nodeParents[nodeParent];
  }
  path.unshift(networkGraph[nodeParent].name);

  return path;
};

// BFS(41, 76);
