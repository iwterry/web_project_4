let profileEditSection = document.querySelector('.profile-edit');
let form = document.querySelector('.profile-edit__form');
let nameInputElement = form.querySelector('.profile-edit__form-input_type_name');
let aboutMeInputElement = form.querySelector('.profile-edit__form-input_type_about-me');
let profileName = document.querySelector('.profile__name');
let profileSelfDescription = document.querySelector('.profile__self-description');
let editButton = document.querySelector('.profile__edit-btn');
let closeButton = document.querySelector('.profile-edit__close-btn');


function handleEditProfile() {
  // show the form
  profileEditSection.classList.add('profile-edit_opened');

  // fill in input values with the given text content of the profile
  nameInputElement.value = profileName.textContent;
  aboutMeInputElement.value = profileSelfDescription.textContent;
}

function handleSaveProfile(event) {
  event.preventDefault();

  // fill in profile information from user input
  profileName.textContent = nameInputElement.value;
  profileSelfDescription.textContent = aboutMeInputElement.value;

  // hide the form
  profileEditSection.classList.remove('profile-edit_opened');
}

function handleCloseProfileForm() {
  profileEditSection.classList.remove('profile-edit_opened');
}


editButton.addEventListener('click', handleEditProfile);
form.addEventListener('submit', handleSaveProfile);
closeButton.addEventListener('click', handleCloseProfileForm);