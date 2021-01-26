export default class Api {
  constructor({ headers }) {
    this._baseUrl = 'https://around.nomoreparties.co/v1/group-8';
    this._headers = headers;
  }

  getInitialCards() {
    return this._fetchData({ relativePathFromBase: 'cards' });
  }

  getUserProfile() {
    return this._fetchData({ relativePathFromBase: 'users/me' });
  }

  createCard(name, link) {
    return this._fetchData({ 
      relativePathFromBase: 'cards',
      method: 'POST',
      additionalHeaderProps: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, link })
    });
  }

  updateUserProfile(name, about) {
    return this._fetchData({ 
      relativePathFromBase: 'users/me',
      method: 'PATCH',
      additionalHeaderProps: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, about })
    });
  }

  deleteCard(cardId) {
    return this._fetchData({ 
      relativePathFromBase:  `cards/${cardId}`,
      method: 'DELETE'
    });
  }

  updateUserAvatar(avatarLink) {
    return this._fetchData({ 
      relativePathFromBase: 'users/me/avatar',
      method: 'PATCH',
      additionalHeaderProps: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar: avatarLink })
    });
  }

  updateCardLikes(cardId, isLiking ) {
    return this._fetchData({ 
      relativePathFromBase: `cards/likes/${cardId}`,
      method: (isLiking ? 'PUT' : 'DELETE')
    });
  }
  
  _fetchData({ relativePathFromBase, method='GET', additionalHeaderProps={}, body=null}) {
    const init = {
      method,
      headers: {
        ...this._headers,
        ...additionalHeaderProps
      }
    };

    if(body !== null) {
      init.body = body;
    }

    const url = `${this._baseUrl}/${relativePathFromBase}`;

    return fetch(url, init).then((res) => {
      if(res.ok) return res.json();
      else return Promise.reject(res.status);
    });
  }
}

