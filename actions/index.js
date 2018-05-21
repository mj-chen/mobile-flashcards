export const RECEIVE_DECKS = 'RECEIVE_DECKS'
export const RECEIVE_DECK = 'RECEIVE_DECK'
export const ADD_DECK = 'ADD_DECK'
export const ADD_CARD = 'ADD_CARD'

export const receiveDecks = (type, decks) => ({
    type,
    decks
})

export const receiveDeck = (type, deck) => ({
    type,
    deck
})

export const addDeck = (type, deck) => ({
    type,
    deck
})

export const addCard = (type, question) => ({
    type,
    question
})