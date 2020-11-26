const profileEditSection = document.querySelector('.overlay');
const closeButton = document.querySelector('.overlay__close-btn');

const form = document.querySelector('.web-project-four-form');
const nameInputElement = form.querySelector('.web-project-four-form__input_type_profile-name');
const aboutMeInputElement = form.querySelector('.web-project-four-form__input_type_profile-about-me');

const profileName = document.querySelector('.profile__name');
const profileSelfDescription = document.querySelector('.profile__self-description');
const editButton = document.querySelector('.profile__edit-btn');

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
function handleEditProfile() {
  // fill in input values with the given text content of the profile
  nameInputElement.value = profileName.textContent;
  aboutMeInputElement.value = profileSelfDescription.textContent;
  
  // show the form
  profileEditSection.classList.add('overlay_opened');
}

function handleDeleteLocation(evt) {
  const eventTarget = evt.target;
  eventTarget.closest('.location').remove();
}

function handleLikeLocation(evt) {
  const eventTarget = evt.target;
  eventTarget.classList.toggle('location__like-btn_active');
}

function handleSaveProfile(event) {
  event.preventDefault();

  // fill in profile information from user input
  profileName.textContent = nameInputElement.value;
  profileSelfDescription.textContent = aboutMeInputElement.value;

  // hide the form
  handleCloseProfileForm();
}

function handleCloseProfileForm() {
  profileEditSection.classList.remove('overlay_opened');
}

// ###### helper functions ########
function addLocation({ name: locationName, link: locationImageLink }) {
  const locationElement = locationTemplate.cloneNode(true);

  locationElement.querySelector('.location__name').textContent = locationName;
  locationElement.querySelector('.location__image').style.backgroundImage = `url(${locationImageLink})`;
  locationElement.querySelector('.location__delete-btn').addEventListener('click', handleDeleteLocation);
  locationElement.querySelector('.location__like-btn').addEventListener('click', handleLikeLocation);
  locationsCollection.append(locationElement);
}


// add initial locations to the DOM
initialLocations.forEach(addLocation);

// ####### adding event handlers #######
editButton.addEventListener('click', handleEditProfile);
form.addEventListener('submit', handleSaveProfile);
closeButton.addEventListener('click', handleCloseProfileForm);