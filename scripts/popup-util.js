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