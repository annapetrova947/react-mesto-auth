import React from 'react';

import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import {api} from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup";

function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false)
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false)
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false)
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false)
    const [selectedCard, setSelectedCard] = React.useState(null)
    const [currentUser, setCurrentUser] = React.useState({})
    const [cards, setCards] = React.useState([])


    React.useEffect(()=>{

        api.getCards()
            .then(cards=>{
                setCards(cards)
            })
            .catch((err)=>{console.log(err)});
    }, [])

    React.useEffect(()=>{
        api.getProfileInformation()
            .then(userInformation=>{
                setCurrentUser(userInformation)

            })
            .catch((err)=>{console.log(err)});
    }, [])



    function handleEditAvatarClick(){
        setIsEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)

    }

    function handleCardClick (data){

        setSelectedCard(data)
        setIsImagePopupOpen(true)
    }

    function handleCardLike(card) {

        const isLiked = card.likes.some(i => i._id === currentUser._id);


        api.changeLikeCardStatus(card._id, isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err)=>{console.log(err)});
    }

    function handleUpdateUser(data){
        api.saveProfileInfo(data)
            .then((data)=>{
                setCurrentUser(data)
            })
            .then(()=>{
                closeAllPopups()
            })
            .catch((err)=>{console.log(err)});
    }

    function handleUpdateAvatar(data){
        api.saveAvatar(data)
            .then((data)=>{
                setCurrentUser(data)
            })
            .then(()=>{
                closeAllPopups()
            })
            .catch((err)=>{console.log(err)});
    }

    function handleCardDelete(card){
        api.deleteCard(card._id)
            .then(()=>{
                setCards((data) => data.filter((p) => p._id !== card._id));
            })
            .catch((err)=>{console.log(err)});

    }

    function handleAddCard(data){
        api.createCard(data)
            .then((data)=>{
                setCards([data, ...cards])
            })
            .then(()=>{
                closeAllPopups()
            })
            .catch((err)=>{console.log(err)});
    }

    function closeAllPopups(){
        setIsEditAvatarPopupOpen(false)
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsImagePopupOpen(false)
        setSelectedCard(null);
    }

  return (

      <div className="root">
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>
                <Header />
                <Main
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      cards = {cards}
                />
                <Footer />

                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleAddCard}/>
                <ImagePopup card={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups}/>
                <PopupWithForm name='delete' title='Вы уверены?' save_button='Да'  onClose={closeAllPopups}/>
            </CurrentUserContext.Provider >
        </div>
      </div>

  );
}

export default App;
