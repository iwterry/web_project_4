// ########### defining DOM element variables #########
const overlays = document.querySelectorAll('.overlay');
const closeButtons = document.querySelectorAll('.overlay__close-btn');

const profileName = document.querySelector('.profile__name');
const profileSelfDescription = document.querySelector('.profile__self-description');
const editButton = document.querySelector('.profile__edit-btn');
const addButton = document.querySelector('.profile__add-btn');

const profileEditForm = document.querySelector('.project-form_type_profile-edit');
const profileEditNameInput = profileEditForm
  .querySelector('#profile-name-input');
const profileEditAboutMeInput = profileEditForm
  .querySelector('#profile-about-me-input');

const cardPopupImage = document.querySelector('.image-popup__image');
const cardPopupImageTitle = document.querySelector('.image-popup__title');

const cardCreationForm = document.querySelector('.project-form_type_location-create');
const cardCreationTitleInput = cardCreationForm
  .querySelector('#location-title-input');
const cardCreationImageLinkInput = cardCreationForm
  .querySelector('#location-image-link-input');

const cardsCollection = document.querySelector('.locations__collection');
const cardTemplate = document.querySelector('#location').content;


// ####### defining event handlers #######
// ------ handlers / helpers dealing with overlay / popup
function getOverlay(childOfOrIsAnOverlay) {
  return childOfOrIsAnOverlay.closest('.overlay');
}

function hidePopup(childOfOrIsAnOverlay) {
  getOverlay(childOfOrIsAnOverlay).classList.remove('overlay_opened');
}

function hidePopupByClickingOnOverlay(targetOfClick, overlay) {
  if(targetOfClick === overlay) {
    hidePopup(overlay);
  }
}
 
function showPopup(childOfOrIsAnOverlay) {
  const overlay = getOverlay(childOfOrIsAnOverlay);
  overlay.classList.add('overlay_opened');

  document.addEventListener('keydown', function handleHidePopupThroughEscapeKey(evt) {
    if(evt.key === 'Escape') {
      hidePopup(overlay);
      document.removeEventListener('keydown', handleHidePopupThroughEscapeKey);
    };
  });

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
function handleEditProfile() {
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

function handleAddCard() {
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
editButton.addEventListener('click', handleEditProfile);
addButton.addEventListener('click', handleAddCard);
closeButtons.forEach((closeButton) => closeButton.addEventListener('click', handleHidePopup));
overlays.forEach((overlay) => overlay.addEventListener(
  'click', 
  (evt) => hidePopupByClickingOnOverlay(evt.target, overlay)
));

