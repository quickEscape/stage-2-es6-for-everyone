import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise(resolve => {
    // resolve the promise with the winner when fight is over
    let isGameOver = false;

    const initFighter = (fighter, position) => ({
      ...fighter,
      isBlock: false,
      isCombo: false,
      lastCombo: 0,
      healthRemaining: fighter.health,
      healthPercentage: 100,
      healthIndicator: document.getElementById(`${position}-fighter-indicator`)
    });

    const playerOne = initFighter(firstFighter, 'left');
    const playerTwo = initFighter(secondFighter, 'right');

    const kick = (attacker, defender) => {
      if (attacker.isBlock) return console.log('attacker cannot kick with active block');
      if (defender.isBlock && !attacker.isCombo) return console.log('defender blocked a kick');

      const damage = getDamage(attacker, defender);

      if (attacker.isCombo) comboModeOff(attacker);

      updateHealth(defender, damage);

      const attackerLog = `attacker: ${attacker.name} damage: ${damage}`;
      const defenderLog = `defender: ${defender.name} health: ${defender.healthPercentage}`;
      console.log(`${attackerLog} *** aaaaa${defenderLog}`);

      if (!defender.healthRemaining) {
        document.removeEventListener('keydown', onKeyDownHandler);
        document.removeEventListener('keyup', onKeyUpHandler);
        isGameOver = true;
        resolve(attacker);
      }
    };

    const setBlock = (fighter, state) => {
      fighter.isBlock = state;
    };

    const updateHealth = (fighter, damage) => {
      fighter.healthRemaining = Math.max(0, fighter.healthRemaining - damage);
      fighter.healthPercentage = (fighter.healthRemaining / fighter.health) * 100;
      fighter.healthIndicator.style.width = `${fighter.healthPercentage}%`;
    };

    const onKeyDownHandler = event => {
      switch (event.code) {
        case controls.PlayerOneAttack:
          return kick(playerOne, playerTwo);
        case controls.PlayerTwoAttack:
          return kick(playerTwo, playerOne);
        case controls.PlayerOneBlock:
          return setBlock(playerOne, true);
        case controls.PlayerTwoBlock:
          return setBlock(playerTwo, true);
      }
    };

    const onKeyUpHandler = event => {
      switch (event.code) {
        case controls.PlayerOneBlock:
          return setBlock(playerOne, false);
        case controls.PlayerTwoBlock:
          return setBlock(playerTwo, false);
      }
    };

    const comboOnKeys = (keyCodes, f) => {
      const pressed = new Set();

      document.addEventListener('keydown', event => {
        pressed.add(event.code);

        for (const code of keyCodes) {
          if (!pressed.has(code)) return;
        }
        pressed.clear();

        f();
      });

      document.addEventListener('keyup', event => {
        pressed.delete(event.code);
      });
    };

    const comboModeOn = fighter => {
      fighter.isCombo = true;
      fighter.lastCombo = Date.now();
    };

    const comboModeOff = fighter => {
      fighter.isCombo = false;
    };

    const checkLastCombo = fighter => {
      const timeFromLastCombo = Date.now() - fighter.lastCombo;
      if (timeFromLastCombo < 10000) {
        console.log(`to next combo ${10000 - timeFromLastCombo} ms`);

        return false;
      }
      comboModeOn(fighter);

      return true;
    };

    comboOnKeys(controls.PlayerOneCriticalHitCombination, () => {
      if (!isGameOver && checkLastCombo(playerOne)) kick(playerOne, playerTwo);
    });

    comboOnKeys(controls.PlayerTwoCriticalHitCombination, () => {
      if (!isGameOver && checkLastCombo(playerTwo)) kick(playerTwo, playerOne);
    });

    document.addEventListener('keydown', onKeyDownHandler);
    document.addEventListener('keyup', onKeyUpHandler);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return Math.max(0, damage);
}

export function getHitPower(fighter) {
  // return hit power
  const criticalHitChance = fighter.isCombo ? 2 : getSuperRandom();
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = getSuperRandom();
  return fighter.defense * dodgeChance;
}

const getSuperRandom = () => Math.random() + 1;
