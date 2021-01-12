 export const initialCardObjs = [
  {
    name: "Yosemite Valley",
    link: "https://code.s3.yandex.net/web-code/yosemite.jpg"
  },
  {
    name: "Lake Louise",
    link: "https://code.s3.yandex.net/web-code/lake-louise.jpg"
  },
  {
    name: "Bald Mountains",
    link: "https://code.s3.yandex.net/web-code/bald-mountains.jpg"
  },
  {
    name: "Latemar",
    link: "https://code.s3.yandex.net/web-code/latemar.jpg"
  },
  {
    name: "Vanoise National Park",
    link: "https://code.s3.yandex.net/web-code/vanoise.jpg"
  },
  {
    name: "Lago di Braies",
    link: "https://code.s3.yandex.net/web-code/lago.jpg"
  }
]; 


export const profileNameSelector = '.profile__name';
export const profileSelfDescriptionSelector = '.profile__self-description';
export const editBtnElement = document.querySelector('.profile__edit-btn');
export const addBtnElement = document.querySelector('.profile__add-btn');

export const profileEditFormSelector = '.project-form_type_profile-edit';
export const cardCreationFormSelector = '.project-form_type_location-create';
export const formInputSelector = '.project-form__input';

export const cardTemplateSelector = '#location';
export const cardsCollectionSelector = '.locations__collection';
export const formElements = document.querySelectorAll('.project-form');

export const cardPopupImageSelector = '.image-popup__image';
export const cardPopupImageTitleSelector= '.image-popup__title';

export const popupCssObj = {
  popupSelector: '.overlay',
  openedPopupClassName: 'overlay_opened',
  clickedToClosePopupSelector: '.overlay__close-btn'
}

export const settingsObj = {
  inputSelector: formInputSelector,
  inputErrorMsgSelectorPrefix: '.project-form__input-error_field_',
  submitBtnSelector: '.project-form__submit-btn',
  disabledButtonClass: 'project-form__submit-btn_disabled',
  inputErrorClass: 'project-form__input_type_error',
  errorMsgVisibilityClass: 'project-form__input-error_active',
};