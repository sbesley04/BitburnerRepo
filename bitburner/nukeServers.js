/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.getServerNames();
    ns.tprint(`Loaded ${servers.length} servers`);
    while (true) {        
        for (const server of servers) {
            if (!ns.hasRootAccess(server)) {
                const portCount = ns.getServerNumPortsRequired(server);
                let portsOpened = 0;

                if (ns.fileExists("BruteSSH.exe", "home")) {
                    ns.brutessh(server);
                    portsOpened++;
                }
                if (ns.fileExists("FTPCrack.exe", "home")) {
                    ns.ftpcrack(server);
                    portsOpened++;
                }
                if (ns.fileExists("relaySMTP.exe", "home")) {
                    ns.relaysmtp(server);
                    portsOpened++;
                }
                if (ns.fileExists("HTTPWorm.exe", "home")) {
                    ns.httpworm(server);
                    portsOpened++;
                }
                if (ns.fileExists("SQLInject.exe", "home")) {
                    ns.sqlinject(server);
                    portsOpened++;
                }

                if (portsOpened >= portCount) {
                    ns.nuke(server);
                    ns.tprint(`Gained root access on ${server}`);
                }
            }





        await ns.sleep(1000);
    }




}