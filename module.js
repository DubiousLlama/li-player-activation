/**
 * TODO: Migrate to a better type repository so that the ignore directives can
 * be removed OR even moar updates to foundry-pc-types T_T
 */
Hooks.once("ready", () => {
    // Only a gm can approve, so only register the socket handler for them
    if (!game.user.isGM)
        return;
    console.log("li-player-request | Registering socket callback");
    /** @ts-ignore */
    game.socket.on("module.li-player-request", function (data) {
        var _a, _b, _c;
        // Get data to pass to the form
        const combat = game.combats.find((c) => c.id === data.combat);
        const combatant = combat.getCombatant(data.combatant);
        const combatant_name = ((_b = (_a = combatant.token) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : combatant.name);
        const player_name = (_c = game.users.get(data.user)) === null || _c === void 0 ? void 0 : _c.name;
        combat.activateCombatant(data.combatant)
    });
});

/** This hook runs whenever a player that doesn't have permission to modify the
 * combat tracker clicks the activation button of a unit that still has
 * activations left. The hook passes the combat, the combatant id, and the user
 * id of the user that clicked the button.
 */
Hooks.on("LancerCombatRequestActivate", (combat, combatantId) => {
    // Only request for owned combatants that have activations available
    const combatant = combat.getCombatant(combatantId);
    if (combatant.permission < 3 || combatant.flags.activations.value < 1 || !combat.started) {
        return;
    }
    // send a request to activate to the GM(s)
    console.log("Sending activation request for " + combatantId);

    game.socket.emit("module.li-player-request", {
        scene: combat.scene._id,
        combat: combat.id,
        combatant: combatantId,
        user: game.userId,
    });
});
export {};
//# sourceMappingURL=module.js.map