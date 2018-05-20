import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated
} from "react-native"
import { saveDeckTitle, makeId, getDecks } from '../utils/helpers'
import { ADDDECK, addDeck } from '../actions'
import { connect } from 'react-redux'
import { Ionicons } from "@expo/vector-icons";

class AddDeck extends Component {

    state = {
        title: null,
        bounce: new Animated.Value(1),
        opacity: new Animated.Value(0)
    }

    addDeck = () => {
        const { title, bounce, opacity } = this.state
        const id = makeId()
        const newDeck = { [id]: { id, title, questions: [] } }
        saveDeckTitle(newDeck)
            .then(() => this.props.dispatch(addDeck(ADDDECK, newDeck)))
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
                ]).start()
            )
        this.setState({ title: null })
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View>
                    <Text style={styles.title}>
                        What is the title of your new deck?
              </Text>
                </View>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        value={this.state.title}
                        placeholder="Deck Title"
                        onChangeText={title => this.setState({ title })}
                    />
                </View>
                <Animated.View style={{ marginVertical: 40, opacity: this.state.opacity, transform: [{ scale: this.state.bounce }] }}>
                    <Ionicons
                        name={Platform.OS === 'ios' ? 'ios-checkmark-circle-outline' : 'md-checkmark-circle'}
                        color='green'
                        size={50}
                    />
                </Animated.View>
                <TouchableOpacity onPress={this.addDeck} style={styles.button}>
                    <Text style={{ fontSize: 20, color: "white" }}>
                        Submit
              </Text>
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
    title: {
        fontSize: 35,
        alignSelf: 'stretch',
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    form: {
        alignSelf: 'stretch',
        marginVertical: 30,
        marginHorizontal: 30,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.6)',
        height: 50,
    },
    input: {
        fontSize: 20,
        padding: 10,
    },
    button: {
        marginHorizontal: 40,
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: 'black',
        paddingHorizontal: 50,
        paddingVertical: 20
    }
})

const mapStateToProps = (state) => {
    return {
        decks: state.decks
    }
}

export default connect(mapStateToProps)(AddDeck)