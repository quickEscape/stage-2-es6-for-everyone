import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';
import { createFighterImage } from '../fighterPreview';

export function showWinnerModal(fighter) {
  // call showModal function
  const { name } = fighter;
  const body = createElement({ tagName: 'div', className: 'modal-body' });
  const image = createFighterImage(fighter);
  const resetBtn = createElement({ tagName: 'button', className: 'modal-reset' });

  const reloadPage = () => window.location.reload();

  resetBtn.innerText = 'NEW GAME';
  resetBtn.addEventListener('click', reloadPage);

  body.append(image, resetBtn);

  showModal({
    title: `Congratulations!\nWINNER IS ${name}`,
    bodyElement: body,
    onClose: reloadPage
  });
}
