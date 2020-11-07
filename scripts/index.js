function handleEditProfile() {
  let profileEditSection = document.querySelector('.profile-edit');
  profileEditSection.classList.add('profile-edit_opened');
}

function handleSaveProfile(event) {
  event.preventDefault();

  // retrieve elements that have user input
  let form = document.querySelector('.profile-edit__form');
  let nameInputElement = form.querySelector('.profile-edit__form-input_type_name');
  let aboutMeInputElement = form.querySelector('.profile-edit__form-input_type_about-me');

  // retreive elements where the user input will go
  let profile = document.querySelector('.profile');
  let profileName = profile.querySelector('.profile__name');
  let profileSelfDescription = profile.querySelector('.profile__self-description');

  // place user input where it needs to go
  profileName.textContent = nameInputElement.value;
  profileSelfDescription.textContent = aboutMeInputElement.value;

  handleCloseProfileForm();
}

function handleCloseProfileForm() {
  let form = document.querySelector('.profile-edit__form');
  let nameInputElement = form.querySelector('.profile-edit__form-input_type_name');
  let aboutMeInputElement = form.querySelector('.profile-edit__form-input_type_about-me');

  // close and reset form
  nameInputElement.value = '';
  aboutMeInputElement.value = '';

  let profileEditSection = document.querySelector('.profile-edit');
  profileEditSection.classList.remove('profile-edit_opened');
}

let editButton = document.querySelector('.profile__edit-btn');
let saveButton = document.querySelector('.profile-edit__form-button');
let closeIcon = document.querySelector('.profile-edit__close-icon');

editButton.addEventListener('click', handleEditProfile);
saveButton.addEventListener('click', handleSaveProfile);
closeIcon.addEventListener('click', handleCloseProfileForm);