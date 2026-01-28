import { buildGameSnapshot, loadGameSnapshot } from "./gameSnapshot.js";



/** @param {NS} ns */

export async function main(ns) {
    const snap = buildGameSnapshot(ns);
    ns.tprint(`Accessible hosts: ${snap.accessibleHosts.join(", ")}`);
    const saved = loadGameSnapshot(ns);
    ns.tprint(`Saved snapshot present: ${saved ? "yes" : "no"}`);





}