import Card from '../components/Card.js';

export function getNewCardElement(cardTemplateSelector, data,  handlers) {
  const newCard = new Card(
    cardTemplateSelector,
    data,
    handlers
  );

  return newCard.generateNewCardElement();
}