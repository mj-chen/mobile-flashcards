import { RECEIVE_DECKS, RECEIVE_DECK, ADD_DECK, ADD_CARD } from '../actions'
import { combineReducers } from 'redux'

const decks = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_DECKS:
            return action.decks
        case ADD_DECK:
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
        case RECEIVE_DECK:
            return action.deck
        case ADD_CARD:
            const newQuestion = action.question;
            return { ...state, ...{ questions: [...state.questions, ...newQuestion] } }
        default:
            return state
    }
}

export default combineReducers({ decks, deck })