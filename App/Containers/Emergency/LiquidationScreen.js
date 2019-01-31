import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView,
    Linking
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import OrdersActions from '../../Redux/OrdersRedux'
import {
    ApplicationStyles,
    Images,
    Colors,
    Fonts
} from '../../Themes'
import Button from '../../Components/Button'
import NavigationIcon from '../../Components/NavigationIcon'

class LiquidationScreen extends Component {

    state = {
        condition: 'LIQUIDATION'
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.postingOrder && !nextProps.postingOrder) {
            this.setState({ condition: 'LIQUIDATION_SUCCESS' })
            this.props.navigation.setParams({ condition: 'LIQUIDATION_SUCCESS' })
        }
    }

    static navigationOptions = (props) => {
        const condition = props.navigation.getParam('condition')
        return {
            headerLeft: condition === 'LIQUIDATION_SUCCESS' ?
            null :
            (
                <NavigationIcon
                    onPress={() => props.navigation.pop()}
                    source={Images.back}
                />
            )
        }
    }

    requestOrders = () => {
        const {
            positions,
            postOrder,
            resetOrderStatus
        } = this.props

        resetOrderStatus()
        positions.map(item => {
            const updatedItem = {
                ...item,
                type: "market",
                time_in_force: "gtc",
                side: "sell"
            }
            postOrder(updatedItem)
        })
    }

    getPositionsArray = () => {
        const { positions } = this.props
        let symbols = ''
        positions.map(item => {
            let div = symbols.length > 0 ? ', ' : ''
            symbols = symbols + div + item.symbol
        })

        return symbols
    }

    openURL = () => {
        const docUrl = 'https://docs.alpaca.markets/broker-functions/pdt-protection/'
        Linking.canOpenURL(docUrl).then(supported => {
            if (supported) {
                Linking.openURL(docUrl);
            } else {
                console.log("Don't know how to open URI: " + docUrl);
            }
        })
    }

    renderContent = () => {
        const { condition } = this.state
        const { positions, postingOrder, orderResult, postOrderFailCount } = this.props

        let content
        if (condition === 'LIQUIDATION') {
            content = (
                <View style={styles.container}>
                    <ScrollView style={styles.scroll}>
                        <Text style={styles.h1}>
                            Liquidating{"\n"}
                            All Positions
                        </Text>
                        <Text style={[styles.h3, { marginTop: 20 }]}>
                            You are placing an order to sell all your positions with market order within Alpaca's Pattern Day Trader (PDT) Protection.{"\n"}
                            Therefore, some or all of your orders may get rejected if it could potentially result in the account being flagged for PDT.{"\n"}
                            This protection triggers only when the account equity is less than $25k at the time of order submission.
                        </Text>
                        <Text style={styles.linkText} onPress={this.openURL}>
                            (Please see the doc for more information){"\n"}
                        </Text>
                        <Text style={styles.h3}>
                            You currently have {positions.length} total positions in {this.getPositionsArray()}.
                        </Text>
                    </ScrollView>
                    <Button
                        style={styles.button}
                        label="Click to Submit"
                        color={Colors.COLOR_NAV_HEADER}
                        labelColor={Colors.BLACK}
                        height={50}
                        isLoading={postingOrder}
                        onPress={this.requestOrders}
                    />
                </View>
            )
        } else if (condition === 'LIQUIDATION_SUCCESS') {
            const orderStatus = postOrderFailCount > 0 ? `Order Submitted (${postOrderFailCount} orders rejected)` : 'Order Submitted'
            content = (
                <View style={styles.container}>
                    <Text style={styles.label}>
                        {orderStatus}
                    </Text>
                    {
                        orderResult &&
                        <ScrollView style={styles.jsonData}>
                            <Text style={{ color: 'white' }}>
                                {JSON.stringify(orderResult, undefined, 4)}
                            </Text>
                        </ScrollView>
                    }
                    <Button
                        style={styles.button}
                        label="Done"
                        color={Colors.COLOR_NAV_HEADER}
                        labelColor={Colors.BLACK}
                        height={50}
                        onPress={() => this.props.navigation.pop()}
                    />
                </View>
            )
        }

        return content
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderContent()}
            </View>
        )
    }
}

const styles = {
    ...ApplicationStyles.screen,
    h1: {
        ...Fonts.style.h1,
        color: Colors.BLACK,
    },
    h3: {
        ...Fonts.style.h3,
        color: Colors.BLACK,
    },
    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    jsonData: {
        flex: 1,
        marginTop: 20,
        marginBottom: 70,
        paddingLeft: 5,
        backgroundColor: Colors.COLOR_CORE_TEXT
    },
    scroll: {
        marginBottom: 60
    },
    linkText: {
        ...Fonts.style.h3,
        color: Colors.BLACK,
        textDecorationLine: 'underline'
    }
}

const mapStateToProps = (state) => {
    return {
        postingOrder: state.orders.postingOrder,
        positions: state.positions.positions,
        orderResult: state.orders.orderResult,
        postOrderFailCount: state.orders.postOrderFailCount
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postOrder: data => dispatch(OrdersActions.postOrderAttempt(data)),
        resetOrderStatus: () => dispatch(OrdersActions.resetOrderStatus())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiquidationScreen)