import { AsyncStorage } from 'react-native'
import { Permissions, Notifications } from 'expo'

export const MOBILE_FLASHCARDS = 'mobile_flashcards'
export const MOBILE_FLASHCARDS_NOTE = 'mobile_flashcards_note'

export function makeId(){
    function s4(){
        return Math.floor((1+Math.random())*0x10000)
            .toString(16)
            .substring(1)
    }
    return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
}


export function getDecks() {
   return AsyncStorage.getItem(MOBILE_FLASHCARDS)
        .then(data => {
            if(data===null){
                return formatCardsData()
            }else{
                let results = JSON.parse(data)
                return results
            }
        })
}

function formatCardsData(){
    const data = {
            '8e7090a1-0fa4-8a63-6aa8-15e8ba595e75': { 
                id: '8e7090a1-0fa4-8a63-6aa8-15e8ba595e75',
                title:'React',
                questions: [
                    {
                        question: 'What is React?',
                        answer: 'A library for managing user interfaces'
                    },
                    {
                        question: 'Where do you make Ajax requests in React?',
                        answer: 'The componentDidMount lifecycle event'
                    }
                ]
            },
            '1b997497-5c5d-40ab-390c-fd084a215ffc': { 
                id: '1b997497-5c5d-40ab-390c-fd084a215ffc',
                title:'JavaScript', 
                questions: [
                    {
                        question: 'What is a closure?',
                        answer: 'The combination of a function and the lexical environment within which that function was declared.'
                    }
                ]
            }
    }
    AsyncStorage.setItem(MOBILE_FLASHCARDS, JSON.stringify(data))
    return data
}

export function getDeck(id) {
    return AsyncStorage.getItem(MOBILE_FLASHCARDS)
        .then(JSON.parse)
        .then(data=>data[`${id}`])
}

export function saveDeckTitle(newDeck) {
    return AsyncStorage.mergeItem(
        MOBILE_FLASHCARDS,
        JSON.stringify(newDeck)
    )    
}

export function addCardToDeck(id,card) {
   if (card){
    return getDeck(id).
        then(deck=>{ 
            AsyncStorage.mergeItem(
                MOBILE_FLASHCARDS, 
                JSON.stringify({
                [id]:{
                    questions:[
                        ...deck.questions,
                        card
                    ]
                }})
            )
        })
   }
}

const localNotification =()=>({
    title:'What do you think about a litte quiz?',
    body:"Don't forget to take a quiz today",
    ios:{
        sound:true
    },
    android:{
        sound:true,
        priority:'high',
        vibrate:true
    }
})

export const clearLocalNotifications=()=>{    
    return Notifications.cancelAllScheduledNotificationsAsync()
        .then(()=>AsyncStorage.removeItem(MOBILE_FLASHCARDS_NOTE))
}

export const setLocalNotifications =()=>{
    AsyncStorage.getItem(MOBILE_FLASHCARDS_NOTE)
      .then(JSON.parse)
      .then(data => {
        if (data === null) {
            Permissions.askAsync(Permissions.NOTIFICATIONS)
            .then(({ status }) => {
              if (status === "granted") {
                Notifications.cancelAllScheduledNotificationsAsync();
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(18);
                tomorrow.setMinutes(0);
                Notifications.scheduleLocalNotificationAsync(
                  localNotification(),
                  {
                    time: tomorrow,
                    repeat: "day"
                  }
                )
              }
            }
          )
          AsyncStorage.setItem(MOBILE_FLASHCARDS_NOTE, JSON.stringify(true))
        }
      })
}