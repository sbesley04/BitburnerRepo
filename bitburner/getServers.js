/** @param {NS} ns **/
export function getAllServers(ns, root = 'home') {
    const visited = new Set();
    const result = [];

    function walk(host) {
        if (visited.has(host)) return;
        visited.add(host);
        result.push(host);
        for (const neighbor of ns.scan(host)) {
            if (!visited.has(neighbor)) walk(neighbor);
        }
    }

    walk(root);
    return result;
}

export async function main(ns) {
    const servers = getAllServers(ns);
    ns.tprint(JSON.stringify(servers));
    return servers;
}