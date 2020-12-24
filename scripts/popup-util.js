const cardPopupImage = document.querySelector('.image-popup__image');
const cardPopupImageTitle = document.querySelector('.image-popup__title');

export function getOverlay(childOfOrIsAnOverlay) {
  return childOfOrIsAnOverlay.closest('.overlay');
}

export function hidePopup(childOfOrIsAnOverlay) {
  getOverlay(childOfOrIsAnOverlay).classList.remove('overlay_opened');
  document.removeEventListener('keydown', handleHidePopupThroughEscapeKey);
}

export function handleHidePopupThroughEscapeKey(evt) {
  if(evt.key === 'Escape') {
    const openedOverlay = document.querySelector('.overlay_opened');
    if(openedOverlay !== null) {
      hidePopup(openedOverlay);
    }  
  }
}

export function hidePopupByClickingOnOverlay(targetOfClick, overlay) {
  if(targetOfClick === overlay) {
    hidePopup(overlay);
  }
}
 
export function showPopup(childOfOrIsAnOverlay) {
  const overlay = getOverlay(childOfOrIsAnOverlay);
  overlay.classList.add('overlay_opened');

  document.addEventListener('keydown', handleHidePopupThroughEscapeKey);
}

export function handleHidePopup(evt) {
  const overlayCloseButton = evt.target;
  hidePopup(overlayCloseButton);
}

export function showCardImageWithPopup(cardImageLink, cardImageAlt) {
  cardPopupImage.src = cardImageLink;
  cardPopupImage.alt = cardImageAlt;
  cardPopupImageTitle.textContent = cardImageAlt;

  showPopup(cardPopupImage);
}