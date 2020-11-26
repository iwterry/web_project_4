const profileEditSection = document.querySelector('.profile-edit');
const form = document.querySelector('.profile-edit__form');
const nameInputElement = form.querySelector('.profile-edit__form-input_type_name');
const aboutMeInputElement = form.querySelector('.profile-edit__form-input_type_about-me');
const profileName = document.querySelector('.profile__name');
const profileSelfDescription = document.querySelector('.profile__self-description');
const editButton = document.querySelector('.profile__edit-btn');
const closeButton = document.querySelector('.profile-edit__close-btn');
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
  profileEditSection.classList.add('profile-edit_opened');
}

function handleDeleteLocation(evt) {
  const eventTarget = evt.target;
  eventTarget.closest('.location')
    .classList
    .add('location_inactive');
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
  profileEditSection.classList.remove('profile-edit_opened');
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