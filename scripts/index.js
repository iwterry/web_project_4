// ########### defining DOM variables #########
const closeButtons = document.querySelectorAll('.overlay__close-btn');

const locationPopupImage = document.querySelector('.image-popup__image');
const locationPopupImageTitle = document.querySelector('.image-popup__title');

const profileEditForm = document.querySelector('.web-project-four-form_type_profile-edit');
const profileEditNameInput = profileEditForm
  .querySelector('.web-project-four-form__input_type_profile-name');
const profileEditAboutMeInput = profileEditForm
  .querySelector('.web-project-four-form__input_type_profile-about-me');

const locationCreationForm = document.querySelector('.web-project-four-form_type_location-create');
const locationCreationTitle = locationCreationForm
  .querySelector('.web-project-four-form__input_type_location-title');
const locationCreationImageLink = locationCreationForm
  .querySelector('.web-project-four-form__input_type_location-image-link');

const profileName = document.querySelector('.profile__name');
const profileSelfDescription = document.querySelector('.profile__self-description');
const editButton = document.querySelector('.profile__edit-btn');
const addButton = document.querySelector('.profile__add-btn');

const locationsCollection = document.querySelector('.locations__collection');
const locationTemplate = document.querySelector('#location').content;

const initialLocations = [
  {
    name: "Yosemite Valley",
    link: "./images/location-yosemite-valley.jpg"
  },
  {
    name: "Lake Louise",
    link: "./images/location-lake-louise.jpg"
  },
  {
    name: "Bald Mountains",
    link: "./images/location-bald-mountains.jpg"
  },
  {
    name: "Latemar",
    link: "./images/location-latemar.jpg"
  },
  {
    name: "Vanoise National Park",
    link: "./images/location-vanoise-national-park.jpg"
  },
  {
    name: "Lago di Braies",
    link: "./images/location-lago-di-braies.jpg"
  }
];


// ####### defining event handlers #######
// ------ handlers / helpers dealing with overlay
function getOverlay(childOfOrIsAnOverlay) {
  return childOfOrIsAnOverlay.closest('.overlay');
}

function closeOverlay(childOfOrIsAnOverlay) {
  getOverlay(childOfOrIsAnOverlay).classList.remove('overlay_opened');
 }
 
 function openOverlay(childOfOrIsAnOverlay) {
   getOverlay(childOfOrIsAnOverlay).classList.add('overlay_opened');
 }

function handleCloseOverlay(evt) {
  const overlayCloseButton = evt.target;
  closeOverlay(overlayCloseButton);
}

// ------ handlers dealing with editing profile
function handleEditProfile() {
  // fill in input values with the given text content of the profile
  profileEditNameInput.value = profileName.textContent;
  profileEditAboutMeInput.value = profileSelfDescription.textContent;
  
  // show the form
  openOverlay(profileEditForm);
}

function handleSaveProfile(evt) {
  evt.preventDefault();

  // fill in profile information from user input
  profileName.textContent = profileEditNameInput.value;
  profileSelfDescription.textContent = profileEditAboutMeInput.value;

  // hide the form
  closeOverlay(profileEditForm);
}

// -------- handlers / helpers dealing with location
function handleAddLocation() {
  openOverlay(locationCreationForm);
}

function handleSaveLocation(evt) {
  evt.preventDefault();

  addLocation({
    name: locationCreationTitle.value,
    link: locationCreationImageLink.value
  });

  closeOverlay(locationCreationForm);
}

function handleDeleteLocation(evt) {
  const eventTarget = evt.target;
  eventTarget.closest('.location').remove();
}

function handleLikeLocation(evt) {
  const eventTarget = evt.target;
  eventTarget.classList.toggle('location__like-btn_active');
}

function addLocation({ name: locationName, link: locationImageLink }) {
  const locationElement = locationTemplate.cloneNode(true);
  const locationImage = locationElement.querySelector('.location__image');

  locationImage.src = locationImageLink;
  locationImage.alt = locationName;
  locationElement.querySelector('.location__name').textContent = locationName;

  locationElement.querySelector('.location__delete-btn').addEventListener('click', handleDeleteLocation);
  locationElement.querySelector('.location__like-btn').addEventListener('click', handleLikeLocation);
  locationElement.querySelector('.location__image').addEventListener('click', handleSelectImage);

  locationsCollection.prepend(locationElement);
}

// ------ handlers dealing with selecting popup image
function handleSelectImage(evt) {
  const locationImage = evt.target;

  locationPopupImage.src = locationImage.src;
  locationPopupImage.alt = locationImage.alt;
  locationPopupImageTitle.textContent = locationImage.alt;

  openOverlay(locationPopupImage);
}

// ######### adding locations and handlers #######
// ------ add initial locations to the DOM
initialLocations.forEach(addLocation);

//---- adding event handlers
editButton.addEventListener('click', handleEditProfile);
profileEditForm.addEventListener('submit', handleSaveProfile);
addButton.addEventListener('click', handleAddLocation);
locationCreationForm.addEventListener('submit', handleSaveLocation);
closeButtons.forEach((closeButton) => closeButton.addEventListener('click', handleCloseOverlay));