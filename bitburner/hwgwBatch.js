import { getServers } from '/bitburner/getServers.js';

/** @param {NS} ns */
/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        const servers = await getServers(ns);
        ns.tprint(`Loaded ${servers.length} servers`);
        await ns.sleep(1000);
    }
}