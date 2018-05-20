import React, { Component } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Animated, Platform, AsyncStorage } from 'react-native'
import { getDeck, clearLocalNotifications, setLocalNotifications, MOBILE_FLASHCARDS_NOTE } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'


class Quiz extends Component {
    state = {
        deck: this.props.deck,
        index: 0,
        correct: 0,
        total: this.props.deck.questions.length,
        replied: false,
        animatedValue: new Animated.Value(0),
        flipNum: 0,
        completed: false
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Quiz'
        }
    }

    restart = () => {
        this.setState({
            index: 0,
            correct: 0,
            replied: false,
            animatedValue: new Animated.Value(0),
            flipNum: 0,
            completed: false
        })
    }

    correct = () => {
        const { flipNum, correct, index, total } = this.state

        if (flipNum % 2 !== 0) {
            this.flipBackward()
        }
        this.setState(state => {
            return {
                index: state.index + 1,
                correct: state.correct + 1,
                replied: false
            }
        })

        AsyncStorage.getItem(MOBILE_FLASHCARDS_NOTE)
            .then(data => {
                if (data !== null) {
                    clearLocalNotifications()
                        .then(setLocalNotifications)
                }
            })

        if (index + 1 === total) {
            this.setState({
                completed: true
            })
        }
    }

    Incorrect = () => {
        const { flipNum, correct, index, total } = this.state

        if (flipNum % 2 !== 0) {
            this.flipBackward()
        }
        this.setState(state => {
            return {
                index: state.index + 1,
                replied: false
            }
        })

        AsyncStorage.getItem(MOBILE_FLASHCARDS_NOTE)
            .then(data => {
                if (data !== null) {
                    clearLocalNotifications()
                        .then(setLocalNotifications)
                }
            })

        if (index + 1 === total) {
            this.setState({
                completed: true
            })
        }
    }

    flipForward = () => {
        const { animatedValue } = this.state
        Animated.spring(animatedValue, {
            toValue: 180,
            friction: 8,
            tension: 10
        }).start()
        this.setState(state => {
            return {
                flipNum: state.flipNum + 1
            }
        })
    }

    flipBackward = () => {
        const { animatedValue } = this.state
        Animated.spring(animatedValue, {
            toValue: 0,
            friction: 8,
            tension: 10
        }).start()
        this.setState(state => {
            return {
                flipNum: state.flipNum + 1
            }
        })
    }


    flip = () => {
        const { replied } = this.state
        if (!replied) {
            this.flipForward()
        } else {
            this.flipBackward()
        }

        this.setState(state => {
            return {
                replied: !state.replied,
            }
        })
    }

    render() {
        const { deck, index, correct, total, replied, animatedValue, completed, flipNum } = this.state
        return (
            deck ? completed ?
                <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center" }}>
                    <Ionicons name={Platform.OS === "ios" ? "ios-medal-outline" : "md-medal"} size={100} color="#e6b405" />
                    <View>
                        <Text style={{ fontSize: 50 }}>
                            {Math.floor(correct / total * 100)}%
                </Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.buttons} onPress={() => this.props.navigation.goBack()}>
                            <Text style={{ fontSize: 20 }}>Back to deck</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, { backgroundColor: 'black' }]} onPress={this.restart}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Restart</Text>
                        </TouchableOpacity>
                    </View>
                </View> : <View style={styles.container}>
                    <View style={styles.index}>
                        <Text style={{ fontSize: 25 }}>
                            {index + 1} / {total}
                        </Text>
                    </View>
                    <View style={styles.scene}>
                        <View style={styles.card}>
                            <Animated.View style={[
                                styles.quiz,
                                styles.front,
                                {
                                    opacity: flipNum % 2 === 0 ? 1 : 0,
                                    transform: [{
                                        rotateY: animatedValue.interpolate(
                                            {
                                                inputRange: [0, 180],
                                                outputRange: ["0deg", "180deg"]
                                            }
                                        )
                                    }, { perspective: 1000 }]
                                }]}>
                                <Text style={styles.question}>
                                    {index < total
                                        ? deck.questions[index].question
                                        : ""}
                                </Text>
                            </Animated.View>
                            <Animated.View style={[
                                styles.quiz,
                                styles.back,
                                {
                                    opacity: flipNum % 2 === 0 ? 0 : 1,
                                    transform: [{
                                        rotateY: animatedValue.interpolate(
                                            {
                                                inputRange: [0, 180],
                                                outputRange: ["180deg", "360deg"]
                                            }
                                        )
                                    }, { perspective: 1000 }]
                                }]}>
                                <Text style={styles.question}>
                                    {index < total
                                        ? deck.questions[index].answer
                                        : ""}
                                </Text>
                            </Animated.View>
                        </View>
                        <TouchableOpacity style={styles.answerButton} onPress={this.flip}>
                            <Text style={styles.answer}>
                                {replied ? "Question" : "Answer"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.replyButtons}>
                        <TouchableOpacity style={[styles.reply, { backgroundColor: "rgb(7,160,61)" }]} onPress={this.correct}>
                            <Text style={{ fontSize: 15 }}>Correct</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.reply, { backgroundColor: "rgb(201,21,29)" }]} onPress={this.Incorrect}>
                            <Text style={{ fontSize: 15 }}>Incorrect</Text>
                        </TouchableOpacity>
                    </View>
                </View> :
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    scene: {
        position: "relative",
        justifyContent: "space-between",
        alignSelf: "center"
    },
    card: {
        justifyContent: "center",
        alignItems: "center",
    },
    index: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: 20
    },
    quiz: {
        justifyContent: "center",
        alignItems: "center",
        backfaceVisibility: "hidden"
    },
    front: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        width: 300,
        height: 200,
        borderRadius: 5,
        backgroundColor: 'rgba(238,231,231,0.85)'
    },
    back: {
        position: "absolute",
        top: 0,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        width: 300,
        height: 200,
        borderRadius: 5,
        backgroundColor: 'rgba(234,228,188,0.85)'
    },
    question: {
        fontSize: 20
    },
    answerButton: {
        justifyContent: "center",
        alignItems: "center"
    },
    answer: {
        fontSize: 30,
        color: "red"
    },
    replyButtons: {
        marginBottom: 10
    },
    reply: {
        paddingHorizontal: 50,
        paddingVertical: 20,
        borderColor: 'rgba(0,0,0,0.4)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: Platform.OS === "ios" ? 16 : 2,
        marginBottom: 5
    },
    buttons: {
        marginVertical: 10,
        paddingHorizontal: 50,
        paddingVertical: 20,
        borderColor: 'rgba(0,0,0,0.4)',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = (state) => ({
    deck: state.deck
})


export default connect(mapStateToProps)(Quiz)