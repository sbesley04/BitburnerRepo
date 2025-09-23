

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
      const info = ActionInfo(ns);
      let action = DecideAction(ns, info);
      ns.bladeburner.startAction(action[0], action[1]);
      await ns.sleep(ns.bladeburner.getActionTime(action[0], action[1]));
    }
  }
  
  /** @param {NS} ns */
  function ActionInfo(ns) {
    const categories = [
      { name: 'Contracts', list: ns.bladeburner.getContractNames() },
      { name: 'Operations', list: ns.bladeburner.getOperationNames() },
      { name: 'Black Operations', list: ns.bladeburner.getBlackOpNames() },
      { name: 'General', list: ns.bladeburner.getGeneralActionNames() },
    ];
  
    const actionData = {};
  
    for (const category of categories) {
      const type = category.name;
      actionData[type] = [];
  
      for (const actionName of category.list) {
        const [successLow, successHigh] = ns.bladeburner.getActionEstimatedSuccessChance(type, actionName);
        const countRemaining = (type !== 'General') ? ns.bladeburner.getActionCountRemaining(type, actionName) : null;
        const successGap = successHigh-successLow;
        actionData[type].push({
          name: actionName,
          successLow: successLow,
          successHigh: successHigh,
          successGap: successGap,
          countRemaining: countRemaining
        });
      }
    }
  
    return actionData;
  }
  
  /** @param {NS} ns */
  function DecideAction(ns, info) {
    let playerInfo = ns.getPlayer();
    let stamina = ns.bladeburner.getStamina()
  
    if(playerInfo.hp.current<playerInfo.hp.max*(2/3) || (stamina[0]/stamina[1])<.2){
      return ['General', 'Hyperbolic Regeneration Chamber']
    }
    //start with blackOps
    for(const blackOp of info["Black Operations"]){
      if (blackOp.successGap<2 && blackOp.successLow>94){
        return ["Black Operations", blackOp.name]
      }
    }
    const viableOps = info['Operations'].filter(op => op.countRemaining > 0 && op.successLow > 90);
    if (viableOps.length > 0) {
      const repGains = viableOps.map(op => ns.bladeburner.getActionRepGain("Operations", op.name));
      const maxIndex = repGains.indexOf(Math.max(...repGains));
      return ['Operations', viableOps[maxIndex].name];
    }
  
    const viableContracts = info['Contracts'].filter(c => c.countRemaining > 0 && c.successLow > 85);
    if (viableContracts.length > 0) {
      const repGains = viableContracts.map(c => ns.bladeburner.getActionRepGain("Contracts", c.name));
      const maxIndex = [repGains.indexOf(Math.max(...repGains))];
      return ['Contracts', viableContracts[maxIndex[0]].name];
    }
    if(playerInfo.skills.defense< 80){
      return ["General", "Training"]
    }
    return ["General", "Field Analysis"]
  
  } 