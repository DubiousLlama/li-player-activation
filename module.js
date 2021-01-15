
Hooks.once("ready", () => {

    console.log("li-player-activation | Registering socket callback");
    /** @ts-ignore */
    game.socket.on("module.li-player-activation", function (data) {

        const combat = game.combats.find((c) => c.id === data.combat);
        combat.activateCombatant(data.combatant)
    });
});
/** This hook runs whenever a player that doesn't have permission to modify the
 * combat tracker clicks the activation button of a unit that still has
 * activations left. The hook passes the combat and the combatant id.
 */
Hooks.on("LancerCombatRequestActivate", (combat, combatantId) => {
    // Only request for owned combatants that have activations available
    const combatant = combat.getCombatant(combatantId);
    if (combatant.permission < 3 || combatant.flags.activations.value < 1 || !combat.started) {
        return;
    }

    console.log(combatantId + "has activated initiative");

    game.socket.emit("module.li-player-activation", {
        combat: combat.id,
        combatant: combatantId,
    });
});
export {};
//# sourceMappingURL=module.js.map