import { createElement } from '../helpers/domHelper';
import { createHealthIndicator } from '../components/arena';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`
  });

  if (!fighter) {
    const capText = position === 'right' ? 'Player 2' : 'Player 1';
    fighterElement.append(createFighterCap(capText));
  } else {
    const fighterImage = createFighterImage(fighter);
    const fighterHealthIndicator = createHealthIndicator(fighter, position);
    const fighterStats = createElement({
      tagName: 'p',
      className: `fighter-stats`
    });
    const { attack, defense, health } = fighter;
    fighterStats.innerText = `Atk ${attack} • Def ${defense} • HP ${health}`;
    fighterElement.append(fighterHealthIndicator, fighterImage, fighterStats);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes
  });

  return imgElement;
}

function createFighterCap(capText) {
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  fighterName.innerText = capText;
  container.append(fighterName);

  return container;
}
