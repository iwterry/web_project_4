// ########### defining DOM element variables #########
const overlays = document.querySelectorAll('.overlay');
const closeButtons = document.querySelectorAll('.overlay__close-btn');

const profileName = document.querySelector('.profile__name');
const profileSelfDescription = document.querySelector('.profile__self-description');
const editButton = document.querySelector('.profile__edit-btn');
const addButton = document.querySelector('.profile__add-btn');

const profileEditForm = document.forms.profileEditForm;
const profileEditNameInput = profileEditForm.elements.profileName;
const profileEditAboutMeInput = profileEditForm.elements.aboutMe;

const cardPopupImage = document.querySelector('.image-popup__image');
const cardPopupImageTitle = document.querySelector('.image-popup__title');

const cardCreationForm = document.forms.locationCreateForm;
const cardCreationTitleInput = cardCreationForm.elements.locationTitle;
const cardCreationImageLinkInput = cardCreationForm.elements.imageLink;

const cardsCollection = document.querySelector('.locations__collection');
const cardTemplate = document.querySelector('#location').content;


// ####### defining event handlers #######
// ------ handlers / helpers dealing with overlay / popup
function getOverlay(childOfOrIsAnOverlay) {
  return childOfOrIsAnOverlay.closest('.overlay');
}

function hidePopup(childOfOrIsAnOverlay) {
  getOverlay(childOfOrIsAnOverlay).classList.remove('overlay_opened');
  document.removeEventListener('keydown', handleHidePopupThroughEscapeKey);
}

function handleHidePopupThroughEscapeKey(evt) {
  if(evt.key === 'Escape') {
    const openedOverlay = document.querySelector('.overlay_opened');
    if(openedOverlay !== null) {
      hidePopup(openedOverlay);
    }  
  }
}

function hidePopupByClickingOnOverlay(targetOfClick, overlay) {
  if(targetOfClick === overlay) {
    hidePopup(overlay);
  }
}
 
function showPopup(childOfOrIsAnOverlay) {
  const overlay = getOverlay(childOfOrIsAnOverlay);
  overlay.classList.add('overlay_opened');

  document.addEventListener('keydown', handleHidePopupThroughEscapeKey);
}

function handleHidePopup(evt) {
  const overlayCloseButton = evt.target;
  hidePopup(overlayCloseButton);
}

// ------ helpers dealing with popup image
function showCardImageWithPopup(cardImageLink, cardImageAlt) {
  cardPopupImage.src = cardImageLink;
  cardPopupImage.alt = cardImageAlt;
  cardPopupImageTitle.textContent = cardImageAlt;

  showPopup(cardPopupImage);
}

// ------ handlers dealing with editing profile
function handleShowProfileEditForm() {
  // fill in input values with the given text content of the profile
  profileEditNameInput.value = profileName.textContent;
  profileEditAboutMeInput.value = profileSelfDescription.textContent;
  
  // show the form
  showPopup(profileEditForm);
}

function handleSaveProfile(evt) {
  evt.preventDefault();

  // fill in profile information from user input
  profileName.textContent = profileEditNameInput.value;
  profileSelfDescription.textContent = profileEditAboutMeInput.value;

  // hide the form
  hidePopup(profileEditForm);
}

// -------- handlers / helpers dealing with card
function addCardToDom(cardElement) {
  cardsCollection.prepend(cardElement);
}

function handleShowCardCreationForm() {
  showPopup(cardCreationForm);
}

function handleSaveCard(evt) {
  evt.preventDefault();

  const newCardElement = getNewCardElement({
    name: cardCreationTitleInput.value,
    link: cardCreationImageLinkInput.value
  });

  addCardToDom(newCardElement);
  hidePopup(cardCreationForm);
}

function handleDeleteCard(evt) {
  const eventTarget = evt.target;
  eventTarget.closest('.location').remove();
}

function handleLikeCard(evt) {
  const eventTarget = evt.target;
  eventTarget.classList.toggle('location__like-btn_active');
}

function getNewCardElement({ name: cardName, link: cardImageLink }) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector('.location__image');

  cardElement.querySelector('.location__name').textContent = cardName;
  cardImage.src = cardImageLink;
  cardImage.alt = cardName;
  
  cardElement.querySelector('.location__delete-btn').addEventListener('click', handleDeleteCard);
  cardElement.querySelector('.location__like-btn').addEventListener('click', handleLikeCard);
  cardImage.addEventListener('click', function(evt) {
    const cardImage = evt.target;
    showCardImageWithPopup(cardImage.src, cardImage.alt);
  });

  return cardElement;
}

// ######### adding cards and handlers #######
// ------ add initial cards to the DOM
initialCardObjs.forEach((cardObj) => addCardToDom(getNewCardElement(cardObj)));

//---- adding event handlers
editButton.addEventListener('click', handleShowProfileEditForm);
addButton.addEventListener('click', handleShowCardCreationForm);
closeButtons.forEach((closeButton) => closeButton.addEventListener('click', handleHidePopup));
profileEditForm.addEventListener('submit', handleSaveProfile);
cardCreationForm.addEventListener('submit', handleSaveCard);
overlays.forEach((overlay) => overlay.addEventListener(
  'click', 
  (evt) => hidePopupByClickingOnOverlay(evt.target, overlay)
));