import { RECEIVEDECKS, RECEIVEDECK, ADDDECK, ADDCARD } from '../actions'
import { combineReducers } from 'redux'

const decks = (state = {}, action) => {
    switch (action.type) {
        case RECEIVEDECKS:
            return action.decks
        case ADDDECK:
            return {
                ...state,
                ...action.deck
            }
        default:
            return state
    }
}

const deck = (state = {}, action) => {
    switch (action.type) {
        case RECEIVEDECK:
            return action.deck
        case ADDCARD:
            const newQuestion = action.question;
            return { ...state, ...{ questions: [...state.questions, ...newQuestion] } }
        default:
            return state
    }
}

export default combineReducers({ decks, deck })