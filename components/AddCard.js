import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Animated, Image } from 'react-native'
import { addCardToDeck, getDecks } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { ADD_CARD, addCard, RECEIVE_DECKS, receiveDecks } from '../actions'
import { white, green, ligthGrey, golden, blue } from '../utils/colors'

class AddCard extends Component {

    state = {
        question: null,
        answer: null,
        bounce: new Animated.Value(1),
        opacity: new Animated.Value(0)
    }

    addCard = () => {
        const { question, answer, bounce, opacity } = this.state
        const id = this.props.navigation.getParam('cardId')
        if (question && answer) {
            addCardToDeck(id, { question, answer })
                .then(this.props.dispatch(addCard(ADD_CARD, [{ question, answer }])))
                .then(() => {
                    getDecks()
                    .then(decks => {
                        this.props.dispatch(receiveDecks(RECEIVE_DECKS, decks))
                    })
                })
                .then(
                    Animated.sequence([
                        Animated.parallel([
                            Animated.spring(opacity, {
                                toValue: 1,
                                friction: 4,
                                tension: 30
                            }),
                            Animated.spring(bounce, {
                                toValue: 1.3,
                                friction: 4,
                                tension: 30
                            }),
                        ]),
                        Animated.parallel([
                            Animated.spring(opacity, {
                                toValue: 0,
                                friction: 4,
                                tension: 30
                            }),
                            Animated.spring(bounce, {
                                toValue: 1,
                                friction: 4,
                                tension: 30
                            })
                        ])
                    ]).start())

            this.setState({
                question: null,
                answer: null,
            })
        }
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        value={this.state.question}
                        placeholder='The question'
                        onChangeText={question => { this.setState({ question }) }}
                    />
                    <TextInput
                        style={styles.input}
                        value={this.state.answer}
                        placeholder='The Answer'
                        onChangeText={answer => { this.setState({ answer }) }}
                    />
                </View>

                <Animated.View style={{ marginVertical: 40, opacity: this.state.opacity, transform: [{ scale: this.state.bounce }] }}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-checkmark-circle-outline' : 'md-checkmark-circle'}
                        color={green}
                        size={70}
                    />
                </Animated.View>

                <TouchableOpacity style={styles.button} onPress={this.addCard}>
                    <Text style={{ fontSize: 20, color: white }}> Submit </Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    form: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginTop: 40,
    },
    input: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: blue,
        borderRadius: 10,
        fontSize: 15,
        height: 60,
        marginHorizontal: 20,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: ligthGrey,
        borderRadius: 15,
        backgroundColor: golden,
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginVertical: 20
    }

})

const mapStateToProps = (state) => {
    return {
        deck: state.deck,
        decks: state.decks
    }
}

export default connect(mapStateToProps)(AddCard)