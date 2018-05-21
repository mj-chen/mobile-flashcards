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
import { ADD_DECK, addDeck } from '../actions'
import { connect } from 'react-redux'
import { Ionicons } from "@expo/vector-icons"
import { white, green, grey, blue } from '../utils/colors'

class AddDeck extends Component {

    state = {
        title: null,
    }

    addDeck = () => {
        const { title, bounce, opacity } = this.state
        const id = makeId()
        const newDeck = { [id]: { id, title, questions: [] } }
        saveDeckTitle(newDeck)
            .then(() => this.props.dispatch(addDeck(ADD_DECK, newDeck)))
            .then(()=>{this.setState({ title: null })})
            .then(this.props.navigation.navigate('Detail', { cardId:id, title: title }))
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
                <TouchableOpacity onPress={this.addDeck} style={styles.button}>
                    <Text style={{ fontSize: 20, color: white }}>
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
        borderColor: grey,
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
        backgroundColor: blue,
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