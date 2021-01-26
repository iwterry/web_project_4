import Card from '../components/Card.js';

export function getNewCardElement(cardData, cardTemplateSelector, handlers) {
  const newCard = new Card(
    cardData,
    cardTemplateSelector, 
    handlers
  );

  return newCard.generateNewCardElement();
}