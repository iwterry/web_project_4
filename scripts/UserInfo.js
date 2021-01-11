export default class UserInfo {
  constructor({ nameOfUserSelector, descriptionAboutUserSelector }) {
    this._nameOfUserElement = document.querySelector(nameOfUserSelector);
    this._descriptionAboutUserElement = document.querySelector(descriptionAboutUserSelector);
  }

  getUserInfo() {
    return {
      name: this._nameOfUserElement.textContent,
      description: this._descriptionAboutUserElement.textContent
    };
  }

  setUserInfo({ name, description }) {
    this._nameOfUserElement.textContent = name;
    this._descriptionAboutUserElement.textContent = description;
  }
}