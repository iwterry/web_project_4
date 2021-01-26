export default class UserInfo {
  constructor(
    { nameOfUserSelector, descriptionAboutUserSelector, avatarForUserSelector, avatarOverlaySelector }, 
    handleAvatarOverlayClick
  ) {
    this._nameOfUserElement = document.querySelector(nameOfUserSelector);
    this._descriptionAboutUserElement = document.querySelector(descriptionAboutUserSelector);
    this._avatarImgElement = document.querySelector(avatarForUserSelector);
    this._avatarOverlayElement = document.querySelector(avatarOverlaySelector);
    
    this._id = null;

    this._handleAvatarOverlayClick = handleAvatarOverlayClick;
  }

  getUserInfo() {
    return {
      name: this._nameOfUserElement.textContent,
      description: this._descriptionAboutUserElement.textContent,
      avatarLink: this._avatarImgElement,
      id: this._id
    };
  }

  setUserInfo({ name=null, description=null, avatarLink=null, id=null }) {
    if(name != null) this._nameOfUserElement.textContent = name;
    if(description != null) this._descriptionAboutUserElement.textContent = description;
    if(avatarLink != null) this._avatarImgElement.src = avatarLink;
    if(id != null) this._id = id;

    // coding it this way means that all arguments do not need to be given when setting user information.
  }
  
  setEventListeners() {
    this._avatarOverlayElement.addEventListener('click', this._handleAvatarOverlayClick);
  }
  
}