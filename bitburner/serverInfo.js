import { getAllServers } from "./getServers.js";

/** Build a snapshot of relevant game info */
export function buildGameSnapshot(ns, root = "home") {
    const servers = getAllServers(ns, root);
    const serverDetails = servers.map(host => {
        const s = ns.getServer(host);
        const processes = ns.ps(host).map(p => ({
            filename: p.filename,
            threads: p.threads,
            args: p.args,
            pid: p.pid,
            ramUsage: ns.getScriptRam(p.filename, host) * p.threads
        }));
        return {
            host,
            hasRoot: ns.hasRootAccess(host),
            requiredHackLevel: s.requiredHackingSkill ?? ns.getServerRequiredHackingLevel(host),
            maxMoney: s.moneyMax ?? ns.getServerMaxMoney(host),
            moneyAvailable: s.moneyAvailable ?? ns.getServerMoneyAvailable(host),
            minSecurity: s.minDifficulty ?? ns.getServerMinSecurityLevel(host),
            security: s.hackDifficulty ?? ns.getServerSecurityLevel(host),
            maxRam: s.maxRam ?? s.serverMaxRam ?? (ns.getServer(host).maxRam ?? 0),
            ramUsed: s.ramUsed ?? 0,
            processes,
        };
    });

    const accessible = serverDetails.filter(s => s.hasRoot);
    const totalMoney = serverDetails.reduce((a, s) => a + (s.moneyAvailable || 0), 0);
    const totalMaxMoney = serverDetails.reduce((a, s) => a + (s.maxMoney || 0), 0);
    const totalRam = serverDetails.reduce((a, s) => a + (s.maxRam || 0), 0);
    const usedRam = serverDetails.reduce((a, s) => a + (s.ramUsed || 0), 0);
    const runningScripts = serverDetails.flatMap(s => s.processes.map(p => ({ host: s.host, ...p })));
    const player = ns.getPlayer();
    return {
        timestamp: Date.now(),
        root,
        player,
        servers: serverDetails,
        accessibleHosts: accessible.map(s => s.host),
        totals: {
            totalMoney,
            totalMaxMoney,
            totalRam,
            usedRam,
            runningScriptsCount: runningScripts.length,
        },
        runningScripts,
        homeMoney: ns.getServerMoneyAvailable("home"),
    };
}

/** Save snapshot to /data/gameSnapshot.json on home */
export async function saveGameSnapshot(ns, path = "/data/gameSnapshot.json") {
    const snap = buildGameSnapshot(ns);
    await ns.write(path, JSON.stringify(snap, null, 2), "w");
    return snap;
}

/** Load previously saved snapshot (or null) */
export function loadGameSnapshot(ns, path = "/data/gameSnapshot.json") {
    try {
        const raw = ns.read(path);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export async function main(ns) {
    const snap = buildGameSnapshot(ns);
    ns.tprint(`Snapshot: ${snap.servers.length} servers, ${snap.totals.totalMoney} total money`);
    await saveGameSnapshot(ns);
    return snap;
}