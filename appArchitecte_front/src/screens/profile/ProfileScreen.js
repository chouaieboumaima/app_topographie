// src/screens/profile/ProfileScreen.js

import React, { useEffect, useState } from "react";
import {
View,
Text,
StyleSheet,
Image,
TextInput,
TouchableOpacity,
Alert,
ActivityIndicator,
ScrollView
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import profileService from "../../services/profileService";

export default function ProfileScreen() {

const navigation = useNavigation();

const [user, setUser] = useState(null);
const [name, setName] = useState("");
const [email, setEmail] = useState("");

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);



const fetchProfile = async () => {

setLoading(true);

try {

const data = await profileService.getProfile();

setUser(data);
setName(data.name);
setEmail(data.email);

}
catch (err) {

console.log(err);
Alert.alert("Erreur","Impossible de charger le profil");

}

setLoading(false);

};



const updateProfile = async () => {

setSaving(true);

try {

const updated = await profileService.updateProfile({
name,
email
});

setUser(updated);

Alert.alert("Succès","Profil mis à jour");

}
catch (err) {

console.log(err);
Alert.alert("Erreur","Impossible de mettre à jour le profil");

}

setSaving(false);

};



const logout = () => {

Alert.alert(
"Déconnexion",
"Voulez-vous vraiment vous déconnecter ?",
[
{
text:"Annuler",
style:"cancel"
},
{
text:"Déconnexion",
style:"destructive",
onPress: async () => {

try {

await AsyncStorage.removeItem("access_token");
await AsyncStorage.removeItem("refresh_token");
await AsyncStorage.removeItem("user_role");

navigation.replace("Login");

}
catch(error){

console.log("Erreur logout :",error);

}

}
}
]
);

};



useEffect(()=>{
fetchProfile();
},[]);



if(loading){

return(

<View style={styles.loadingContainer}>

<ActivityIndicator size="large" color="#2d2f30"/>
<Text style={{marginTop:10}}>Chargement du profil...</Text>

</View>

)

}



return(

<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>



<View style={styles.header}>

<View style={styles.avatarWrapper}>

<Image
source={{uri:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}}
style={styles.avatar}
/>

<TouchableOpacity style={styles.editAvatar}>
<MaterialCommunityIcons name="camera" size={18} color="#fff"/>
</TouchableOpacity>

</View>

<Text style={styles.userName}>{name}</Text>
<Text style={styles.userEmail}>{email}</Text>

</View>



<View style={styles.card}>

<Text style={styles.sectionTitle}>Informations personnelles</Text>


<View style={styles.inputGroup}>

<Text style={styles.label}>Nom</Text>

<View style={styles.inputContainer}>

<MaterialCommunityIcons name="account-outline" size={22} color="#555"/>

<TextInput
style={styles.input}
value={name}
onChangeText={setName}
placeholder="Nom"
/>

</View>

</View>


<View style={styles.inputGroup}>

<Text style={styles.label}>Email</Text>

<View style={styles.inputContainer}>

<MaterialCommunityIcons name="email-outline" size={22} color="#555"/>

<TextInput
style={styles.input}
value={email}
onChangeText={setEmail}
placeholder="Email"
keyboardType="email-address"
autoCapitalize="none"
/>

</View>

</View>


<TouchableOpacity
style={styles.updateButton}
onPress={updateProfile}
disabled={saving}
>

{saving
? <ActivityIndicator color="#fff"/>
: (
<View style={styles.buttonContent}>
<MaterialCommunityIcons name="content-save-outline" size={20} color="#fff"/>
<Text style={styles.buttonText}>Mettre à jour</Text>
</View>
)
}

</TouchableOpacity>


</View>



<View style={styles.actions}>

<TouchableOpacity
style={styles.logoutButton}
onPress={logout}
>

<MaterialCommunityIcons name="logout" size={20} color="#fff"/>

<Text style={styles.logoutText}>
Déconnexion
</Text>

</TouchableOpacity>

</View>


</ScrollView>

)

}



const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F4F6F9"
},

loadingContainer:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

header:{
backgroundColor:"#2d2f30",
paddingTop:60,
paddingBottom:30,
alignItems:"center",
borderBottomLeftRadius:30,
borderBottomRightRadius:30
},

avatarWrapper:{
position:"relative"
},

avatar:{
width:110,
height:110,
borderRadius:55,
borderWidth:3,
borderColor:"#fff"
},

editAvatar:{
position:"absolute",
bottom:0,
right:0,
backgroundColor:"#000",
padding:8,
borderRadius:20
},

userName:{
fontSize:20,
fontWeight:"700",
color:"#fff",
marginTop:10
},

userEmail:{
color:"#ddd",
marginTop:3
},

card:{
backgroundColor:"#fff",
marginHorizontal:20,
marginTop:-20,
padding:20,
borderRadius:20,

shadowColor:"#000",
shadowOpacity:0.08,
shadowRadius:10,
shadowOffset:{width:0,height:4},

elevation:4
},

sectionTitle:{
fontSize:16,
fontWeight:"700",
marginBottom:15,
color:"#333"
},

inputGroup:{
marginBottom:15
},

label:{
fontSize:13,
color:"#666",
marginBottom:5
},

inputContainer:{
flexDirection:"row",
alignItems:"center",
borderWidth:1,
borderColor:"#E5E7EB",
borderRadius:14,
paddingHorizontal:12,
backgroundColor:"#F9FAFB"
},

input:{
flex:1,
padding:12,
fontSize:16,
color:"#000"
},

updateButton:{
backgroundColor:"#2d2f30",
padding:16,
borderRadius:18,
alignItems:"center",
marginTop:10
},

buttonContent:{
flexDirection:"row",
alignItems:"center",
gap:10
},

buttonText:{
color:"#fff",
fontWeight:"700",
fontSize:16
},

actions:{
marginTop:30,
paddingHorizontal:20
},

logoutButton:{
backgroundColor:"#ac6360",
padding:15,
borderRadius:16,
flexDirection:"row",
justifyContent:"center",
alignItems:"center",
gap:10
},

logoutText:{
color:"#fff",
fontWeight:"700"
}

});