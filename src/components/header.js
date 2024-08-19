//import libraries
import React from "react";
import { StyleSheet ,View, Text } from "react-native";
import {fetch} from 'react-native';

let userData = "";
async function fetchData()
{
     try {
          const response = await fetch('http://localhost:3000/users');
          userData = await response.json();
          console.log(userData);
          
     } catch (error) {
          console.error(error)
     }
}


//create component
const Header = (props) => { 

      return (
        <View style={styles.headerStyles}>
            <Text style= {
            
            {
                fontWeight: 'bold',
                fontSize: 20,
                color: 'grey'
                        
             }}>{props.title}</Text>
        </View>

      );

 };


//component style

const styles = StyleSheet.create({
     headerStyles: {

        height: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        

     }

}
);



//export component
export default Header;