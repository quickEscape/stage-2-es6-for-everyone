import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise(resolve => {
    // resolve the promise with the winner when fight is over
    const playerOne = initFighter(firstFighter, 'left');
    const playerTwo = initFighter(secondFighter, 'right');

    const kick = (attacker, defender) => {
      if (attacker.isBlock) return;

      const { name } = attacker;
      const damage = getDamage(attacker, defender);

      console.log(`attacker: ${name} damage: ${damage}`);

      updateHealth(defender, damage);

      if (!defender.healthRemaining) {
        document.removeEventListener('keydown', onKeyDownHandler);
        document.removeEventListener('keyup', onKeyUpHandler);
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
      console.log(fighter.healthPercentage);
    };

    const onKeyDownHandler = event => {
      switch (event.code) {
        case controls.PlayerOneAttack:
          kick(playerOne, playerTwo);
          break;
        case controls.PlayerTwoAttack:
          kick(playerTwo, playerOne);
          break;
        case controls.PlayerOneBlock:
          setBlock(playerOne, true);
          break;
        case controls.PlayerTwoBlock:
          setBlock(playerTwo, true);
          break;
      }
    };

    const onKeyUpHandler = event => {
      switch (event.code) {
        case controls.PlayerOneBlock:
          setBlock(playerOne, false);
          break;
        case controls.PlayerTwoBlock:
          setBlock(playerTwo, false);
          break;
      }
    };

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
  const criticalHitChance = getSuperRandom();
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  // return block power
  const dodgeChance = getSuperRandom();
  return fighter.defense * dodgeChance;
}

const getSuperRandom = () => Math.random() + 1;

const initFighter = (fighter, position) => ({
  ...fighter,
  isBlock: false,
  critCountdown: 0,
  healthRemaining: fighter.health,
  healthPercentage: 100,
  healthIndicator: document.getElementById(`${position}-fighter-indicator`)
});
