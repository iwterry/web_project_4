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
export const profileAvatarSelector = '.profile__avatar';
export const profileAvatarOverlaySelector = '.profile__avatar-overlay';
export const editBtnElement = document.querySelector('.profile__edit-btn');
export const addBtnElement = document.querySelector('.profile__add-btn');

export const nameOfProfileEditForm = 'profileEditForm';
export const nameOfCardCreationForm = 'locationCreateForm';
export const nameOfConfirmationPromptForm = 'confirmationPromptForm';
export const nameOfProfileImgChangeForm = 'profileImgChangeForm';
export const formInputSelector = '.project-form__input';

export const cardTemplateSelector = '#location';
export const cardsCollectionSelector = '.locations__collection';

export const cardPopupImageSelector = '.image-popup__image';
export const cardPopupImageTitleSelector = '.image-popup__title';

export const submitBtnTextWhileProcessing = 'Saving...';

// not meant to be exported by themselves at this time; only saved to reduce duplication
const submitBtnSelector = '.project-form__submit-btn';
const disabledSubmitBtnClassName = 'project-form__submit-btn_disabled';

export const popupCssObj = {
  popupSelector: '.overlay',
  openedPopupClassName: 'overlay_opened',
  clickedToClosePopupSelector: '.overlay__close-btn',
  submitBtnSelector,
  disabledSubmitBtnClassName
}

export const settingsObj = {
  inputSelector: formInputSelector,
  inputErrorMsgSelectorPrefix: '.project-form__input-error_field_',
  submitBtnSelector,
  disabledButtonClass: disabledSubmitBtnClassName,
  inputErrorClass: 'project-form__input_type_error',
  errorMsgVisibilityClass: 'project-form__input-error_active',
};

export const cardCssObj = {
  cardSelector: '.location',
  imageSelector: '.location__image',
  likeBtnSelector: '.location__like-btn',
  numLikesSelector: '.location__num-likes',
  deleteBtnSelector: '.location__delete-btn',
  titleSelector: '.location__name',
  deleteBtnActiveClassName: 'location__delete-btn_active',
  likeBtnActiveClassName: 'location__like-btn_active',
};