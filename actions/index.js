export const RECEIVEDECKS = 'receiveDecks'
export const RECEIVEDECK = 'receiveDeck'
export const ADDDECK = 'addDeck'
export const ADDCARD = 'addCard'


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