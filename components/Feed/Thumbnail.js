import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

const imageWidth = Dimensions.get('window').width;
const imageHeight = Dimensions.get('window').height;
const thumbnailHeight = imageHeight/6 


const Item = (props) => (
    <TouchableOpacity onPress = {props.onItemPressed}> 
        <View style={styles.listItem}>
            <Image source={{uri: props.DonatedImage}} style={styles.DonatedImage} />
            <View style={styles.Textlist}>
                <Text style={styles.textCategory}>{props.itemCategory}</Text>
                <Text style={styles.textDescription}>{props.itemdesc}</Text>
                <View style={styles.componentDate}>
                    <Text style={styles.textDate}>{props.itemDate}</Text>
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

    },
    textCategory: {
        fontWeight: 'bold',
        fontSize: imageHeight / 30
    },

    componentDate: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: 5,
        flex: 1
    },
    textDate: {
        fontSize: imageHeight / 50,
        color: 'silver',
    },

    textDescription:{
        fontSize: imageHeight / 40,
        color: 'black'
     },

    DonatedImage: {
        paddingTop: imageHeight / 10,
        marginRight: imageHeight/45,
        height: imageHeight / 6,
        width: imageHeight / 6
    },

    Textlist: {
        flexDirection: "column",
        flex:2
        
    }

});

export default Item;  