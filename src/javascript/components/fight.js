import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise(resolve => {
    // resolve the promise with the winner when fight is over
    if (firstFighter.health <= 0) resolve(firstFighter);
    if (secondFighter.health <= 0) resolve(secondFighter);
  });
}

export function getDamage(attacker, defender) {
  // return damage
}

export function getHitPower(fighter) {
  // return hit power
}

export function getBlockPower(fighter) {
  // return block power
}
