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
        alignContent:'flex-start',
        paddingTop:10
    },
    card: {
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        shadowColor: COLORS.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 5,
    },
    card90: {
        padding: 10,
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
        flexDirection:'row',justifyContent:'space-between',
    },  
    flexRowaround:{
        flexDirection:'row',justifyContent:'space-around',margin:5
    },  
    flexColumnBetween:{
        flexDirection:'column',justifyContent:'space-between'
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
        bottom: 80,
        right: 30,
        backgroundColor: COLORS.primary,
        width: 190,
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
    deleteButton: {
      backgroundColor: 'red',
      padding: 5,
      borderRadius: 5,
      height:35,
      marginTop:20
    },
    deleteText: {
      color: 'white',
      fontWeight: 'bold',
    },

    loadMoreButton: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        margin: 10,
      },
      loadMoreText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
      flexInput: {
        flex: 1, // Membuat input mengisi ruang kosong
        marginRight: 10, // Memberi jarak antara input dan tombol
      },
      input: {
        height: 50,
        borderWidth: 1,
        backgroundColor:COLORS.white,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
      },
})

export default styles;