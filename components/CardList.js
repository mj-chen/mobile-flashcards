import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, AsyncStorage, Platform, ActivityIndicator } from 'react-native'
import { getDecks } from '../utils/helpers'
import { connect } from 'react-redux'
import { RECEIVE_DECKS, receiveDecks } from '../actions'
import { beige, lightGrey, grey, white } from '../utils/colors'

class CardList extends Component {

    state = {
        loaded: false
    }

    componentDidMount() {
        getDecks()
            .then(decks => {
                this.props.dispatch(receiveDecks(RECEIVE_DECKS, decks))
            })
            .then(this.setState({ loaded: true }))
    }

    render() {
        if (this.state.loaded) {
            return (
                <View style={styles.list}>
                    <FlatList
                        data={Object.values(this.props.decks)}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => { this.props.navigation.navigate('Detail', { cardId: item.id, title: item.title }) }}
                            >
                                <Text style={styles.title}>
                                    {item.title}
                                </Text>
                                <Text style={styles.account}>
                                    {item.questions.length} {item.questions.length === 1 ? 'Card' : 'Cards'}
                                </Text>
                            </TouchableOpacity>

                        }
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )
        } else {
            return (
                <View style={styles.list}>
                    <ActivityIndicator />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: beige
    },
    card: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: Platform.OS === "ios" ? 16 : 2,
        borderColor: lightGrey,
        borderWidth: 1,
        borderStyle: "solid",
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        backgroundColor: white
    },
    title: {
        fontSize: 35,
    },
    account: {
        fontSize: 25,
        color: grey
    }
})

const mapStateToProps = (state) => {
    return {
        decks: state.decks
    }
}

export default connect(mapStateToProps)(CardList)