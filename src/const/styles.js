import { StyleSheet } from "react-native";
import COLORS from "./color";

export const styles = StyleSheet.create({
    header:{
        paddingTop:20,
        // marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor:COLORS.primary,
        height:150,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius:30
    },
    container : {
        alignItems:'center',
        padding:10, 
        paddingTop:20
    },
    card90: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        width: '90%',
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 5,
    },
    flexRowBetween:{
        flexDirection:'row',justifyContent:'space-between', marginVertical: 10
    },  
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color:COLORS.dark
    },
    loadingText: {
        fontSize: 18,
        color: COLORS.grey,
    },
    text15: {
        fontSize: 15,
        color: COLORS.dark,
    },
    text18: {
        fontSize: 18,
        color: COLORS.dark,
    },

    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: COLORS.primary,
        width: 150,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        flexDirection: 'row',
    },
    floatingButtonText: {
        color: COLORS.white,
        fontSize: 16,
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.lightGrey,
        marginVertical: 10,
    },
    ButtonLong:{
        backgroundColor:COLORS.primary,
        flexDirection:'row',
        padding:10,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    ButtonText: {
        color: COLORS.white,
        fontSize: 16,
        marginLeft: 10,
        fontWeight:'bold'
    },

})

export default styles;