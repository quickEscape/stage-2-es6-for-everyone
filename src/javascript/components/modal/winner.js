import { showModal } from './modal';

export function showWinnerModal(fighter) {
  // call showModal function
  const { name } = fighter;
  showModal({
    title: `WINNER IS ${name}`,
    bodyElement: 'BODY TEMP',
    onClose: () => console.log('modal closed')
  });
}
