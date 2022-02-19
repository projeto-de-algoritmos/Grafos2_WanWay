let nodeParents = new Array(50);

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

const showPath = (startLAN, endLAN, networkGraph) => {
  const path = [];
  let nodeParent = networkGraph[endLAN].id;
  while (nodeParent !== startLAN) {
    path.unshift(networkGraph[nodeParent].name);
    nodeParent = nodeParents[nodeParent];
  }
  path.unshift(networkGraph[nodeParent].name);

  return path;
};

// BFS(41, 76);
