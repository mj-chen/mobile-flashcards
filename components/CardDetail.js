import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { getDeck } from '../utils/helpers'
import AddDeck from './AddDeck'
import Quiz from './Quiz'
import AddCard from './AddCard'
import { Entypo } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { RECEIVEDECK, receiveDeck } from '../actions'
import { stringify } from 'querystring';


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
            .then(deck => { this.props.dispatch(receiveDeck(RECEIVEDECK, deck)) })
            .then(() => this.setState({ loaded: true }))
    }

    render() {
        if (this.state.loaded) {
            const { deck } = this.props
            return (
                <View style={styles.deck}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 45 }}>{deck.title}</Text>
                        <Text style={{ fontSize: 30, color: "rgba(0,0,0,0.6)" }}>
                            {deck.questions.length} {deck.questions.length === 1 ? 'Card' : 'Cards'}
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate(
                            "AddCard",
                            { cardId: deck.id }
                        )}>
                            <Text style={{ fontSize: 35 }}>Add Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: 'rgb(0,0,0)' }]} onPress={() => this.props.navigation.navigate(
                            "Quiz",
                            { cardId: deck.id }
                        )}>
                            <Text style={{ fontSize: 35, color: 'white' }}>Start Quiz</Text>
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
        borderColor: "rgba(0,0,0,1)",
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



