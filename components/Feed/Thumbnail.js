import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;
const thumbnailHeight = imageHeight/6 

const renderStatus = (status) => {
    if (status === "NONE") {
        return null
    } else if (status === toUpperCase("Pending")) {
        return (
            <Image
            source = {require('../../assets/images/pending.png')}
            style = {{height: imageHeight/30, width: imageHeight/30}}
            />
        )
        
    } else if (status === toUpperCase("Waiting")) {
        return (
            <Image
            source = {require('../../assets/images/waiting.png')}
            style = {{height: imageHeight/30, width: imageHeight/30}}
            />
        )
    } else if (status === toUpperCase("Confirmed")) {
        return (
            <Image
            source = {require('../../assets/images/confirmed.png')}
            style = {{height: imageHeight/30, width: imageHeight/30}}
            />
        )
    }
}


const Item = (props) => (
    <TouchableOpacity style = {{allignItems: 'center'}} onPress = {props.onPress}> 
        <View style={styles.listItem}>
            <Image source={{uri: props.DonatedImage}} style={styles.DonatedImage} />
            <View style={styles.Textlist}>
            <View style = {{flexDirection: "row", width: '100%'}}>
                <View style = {{width: '50%'}}>
                    <Text style={styles.textCategory}>• {props.itemCategory}</Text>
                </View>
                <View style = {{flexDirection: "row", width: '70%', justifyContent: 'center', paddingLeft: imageWidth/20, paddingTop: imageHeight/100}}>
                    {renderStatus(props.itemstatus)}
                </View>
            </View>
                <Text style={styles.textDescription}>•  {props.itemdesc}</Text>
                <View style={styles.componentDate}>
                    <Text style={styles.textDate}>{new Date(props.itemDate).toDateString()}</Text>
                </View>
            </View>
            
            
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        marginBottom: 2, // marginBottom
        width: '100%',
        height: imageHeight/6,
        padding: 0,
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 5,
        paddingTop: imageHeight/150,
        paddingLeft: imageHeight/150,


    },
    textCategory: {
        fontWeight: 'bold',
        fontSize: imageHeight /40,
    },

    textStatus: {
        fontSize: imageHeight /50,
        paddingRight: imageWidth/40,
    },

    componentDate: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: imageHeight/80,
        paddingBottom: imageHeight/100,
        flex: 1
    },
    textDate: {
        fontSize: imageHeight / 45,
        color: 'grey',
    },

    textDescription:{
        fontSize: imageHeight / 45,
        color: 'black'
     },

    DonatedImage: {
        height: imageHeight / 6.5,
        width: imageHeight / 6.5,
        borderRadius: 5,
        borderColor: 'grey',
        borderWidth: 0.5,
    },

    Textlist: {
        flexDirection: "column",
        flex:2,
        paddingLeft: imageHeight/70,
    }

});

export default Item;  