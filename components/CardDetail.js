import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { getDeck } from '../utils/helpers'
import AddDeck from './AddDeck'
import Quiz from './Quiz'
import AddCard from './AddCard'
import { Entypo } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { RECEIVE_DECK, receiveDeck } from '../actions'
import { stringify } from 'querystring'
import { ligthGrey, grey, blue, white, golden } from "../utils/colors"


class CardDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title')
        }
    }

    state = {
        loaded: false
    }

    componentDidMount() {
        const id = this.props.navigation.getParam('cardId')
        getDeck(id)
            .then(deck => { this.props.dispatch(receiveDeck(RECEIVE_DECK, deck)) })
            .then(() => this.setState({ loaded: true }))
    }

    render() {
        if (this.state.loaded) {
            const { deck } = this.props
            const length = deck.questions.length
            return (
                <View style={styles.deck}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 45 }}>{deck.title}</Text>
                        <Text style={{ fontSize: 30, color: grey }}>
                            {length} {length === 1 ? 'Card' : 'Cards'}
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate(
                            "AddCard",
                            { cardId: deck.id }
                        )}>
                            <Text style={{ fontSize: 35 }}>Add Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: golden, display:length>0?'flex':'none' }]} 
                            onPress={() => this.props.navigation.navigate(
                                "Quiz",
                                { cardId: deck.id }
                            )}

                        >
                            <Text style={{ fontSize: 35, color: white }}>Start Quiz</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (<View style={styles.deck}><ActivityIndicator /></View>)
        }
    }
}

const styles = StyleSheet.create({
  deck: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: ligthGrey,
    borderWidth: 1,
    borderRadius: Platform.OS === "ios" ? 16 : 2,
    marginBottom: 20,
    paddingHorizontal: 40,
    paddingVertical: 15
  }
});

const mapStateToProps = (state) => {
    return {
        deck: state.deck
    }
}

export default connect(mapStateToProps)(CardDetail)



