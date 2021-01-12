import Card from '../components/Card.js';

export function getNewCardElement(popupCardData, popupWithImage, cardTemplateSelector) {
  const { name, link } = popupCardData;
  const newCard = new Card(
    popupCardData,
    cardTemplateSelector, 
    () => popupWithImage.open(link, name)
  );

  return newCard.generateNewCardElement();
}