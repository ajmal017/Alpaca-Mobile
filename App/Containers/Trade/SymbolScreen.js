import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView
} from 'react-native'
import { connect } from 'react-redux'

import {
    ApplicationStyles,
    Images,
    Colors,
    Fonts
} from '../../Themes'
import OrdersActions from '../../Redux/OrdersRedux'
import { 
    convert,
    capitalize
} from '../../Util/Helper';
import NavigationIcon from '../../Components/NavigationIcon'
import Button from '../../Components/Button'
import OrderItem from '../Order/OrderItem';
import PositionItem from '../Position/PositionItem';
import SearchItem from './SearchItem';

class SymbolScreen extends Component {

    static navigationOptions = (props) => {
        return {
            headerLeft: (
                <NavigationIcon
                    onPress={() => props.navigation.pop()}
                    source={Images.back}
                />
            ),
            headerRight: (
                <NavigationIcon
                    onPress={() => props.navigation.navigate('Search')}
                    source={Images.search}
                />
            ),
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        const value = navigation.getParam('value')
    }

    renderValueDetail = (value) => {
        const mainValue = `${value.qty}@${value.avg_entry_price}`
        const plStyle = value.unrealized_intraday_pl > 0 ? styles.upText : styles.downText
        const percentValue = (value.unrealized_intraday_plpc * 100).toFixed(2)

        return (
            <View style={styles.container}>
                <View style={styles.positionContain}>
                    <Text style={styles.label}>
                        Positions
                    </Text>
                    <View style={styles.rowContainer}>
                        <Text style={styles.h3}>
                            {mainValue}
                        </Text>
                        <Text style={plStyle}>
                            {convert(percentValue, true)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.label}>
                    Orders
                </Text>
                {/* <OrderItem order={value} /> */}
                <Button
                    style={styles.button}
                    label="Trade"
                    color={Colors.COLOR_NAV_HEADER}
                    labelColor={Colors.BLACK}
                    height={50}
                    onPress={() =>
                        this.props.navigation.navigate('Trade', {
                            value
                        })
                    }
                />
            </View>
        )
    }

    render() {
        const { navigation } = this.props
        const value = navigation.getParam('value')

        return (
            <View style={styles.mainContainer}>
                <SearchItem
                    position={value}
                    symbolStyle={styles.symbol}
                />
                {this.renderValueDetail(value)}
            </View>
        )
    }
}

const styles = {
    ...ApplicationStyles.screen,
    container: {
        ...ApplicationStyles.screen.container,
        marginTop: 30
    },
    h2: {
        ...Fonts.style.h2,
        color: Colors.BLACK
    },
    h3: {
        ...Fonts.style.h3,
        color: Colors.BLACK
    },
    upText: {
        ...Fonts.style.h3,
        color: Colors.COLOR_GREEN,
    },
    downText: {
        ...Fonts.style.h3,
        color: Colors.COLOR_DARK_RED,
    },
    symbol: {
        ...Fonts.style.h1,
        color: Colors.BLACK
    },
    positionContain: {
        marginTop: 40,
        marginBottom: 35
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5
    },
    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    value: {
        ...Fonts.style.h3,
        fontSize: 19,
        color: Colors.COLOR_GOLD
    },
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SymbolScreen)