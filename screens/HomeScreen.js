import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import firebaseConfig from '../config/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import * as Linking from 'expo-linking';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function HomeScreen({navigation}) {
  const [products, setProducts] = useState([]);
  const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [repair,setRepair]=useState('');
  useEffect(()=>{ fetchProducts(); },[]);
  async function fetchProducts(){
    try{
      const snap = await getDocs(collection(db,'products'));
      setProducts(snap.docs.map(d=>({id:d.id,...d.data()})));
    }catch(e){ console.log(e); Alert.alert('Error loading products'); }
  }
  async function placeOrder(p){
    if(!name||!phone) return Alert.alert('Enter name and phone');
    await addDoc(collection(db,'orders'),{productId:p.id,productName:p.name,price:p.price,customerName:name,customerPhone:phone,status:'Pending',createdAt:serverTimestamp()});
    const wa = 'https://wa.me/233256817112';
    Linking.openURL(wa);
    Alert.alert('Order placed');
    setName(''); setPhone('');
  }
  async function requestRepair(){
    if(!name||!phone||!repair) return Alert.alert('Enter details');
    await addDoc(collection(db,'repairs'),{customerName:name,customerPhone:phone,details:repair,status:'Pending',createdAt:serverTimestamp()});
    Alert.alert('Repair requested');
    setRepair(''); setName(''); setPhone('');
  }
  return (
    <View style={s.container}>
      <View style={s.header}><Text style={s.brand}>G.I SMARTS GHANA</Text><Text style={s.slogan}>Smart choice for smart people</Text></View>
      <TextInput placeholder='Name' style={s.input} value={name} onChangeText={setName} />
      <TextInput placeholder='Phone' style={s.input} value={phone} onChangeText={setPhone} keyboardType='phone-pad' />
      <Text style={s.section}>Products</Text>
      <FlatList data={products} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={s.card}><View style={{flex:1}}><Text style={s.title}>{item.name}</Text><Text>GHS {item.price}</Text></View>
        <TouchableOpacity style={s.btn} onPress={()=>placeOrder(item)}><Text style={s.btnText}>Order</Text></TouchableOpacity></View>
      )} />
      <Text style={s.section}>Repair</Text>
      <TextInput placeholder='Describe issue' style={s.input} value={repair} onChangeText={setRepair} />
      <TouchableOpacity style={[s.btn,{marginTop:6}]} onPress={requestRepair}><Text style={s.btnText}>Request Repair</Text></TouchableOpacity>
      <TouchableOpacity style={[s.btn,{backgroundColor:'#25D366',marginTop:12}]} onPress={()=>Linking.openURL('https://wa.me/233256817112')}><Text style={[s.btnText,{color:'#fff'}]}>Chat on WhatsApp</Text></TouchableOpacity>
      <TouchableOpacity style={[s.adminBtn]} onPress={()=>navigation.navigate('Admin')}><Text style={{color:'#D4AF37',fontWeight:'700'}}>Admin Login</Text></TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#fff'},
  header:{alignItems:'center',marginBottom:12},
  brand:{fontSize:26,color:'#D4AF37',fontWeight:'800'},
  slogan:{fontStyle:'italic',color:'#444',marginTop:6},
  input:{borderWidth:1,borderColor:'#ddd',padding:10,borderRadius:8,marginTop:8},
  section:{fontWeight:'700',marginTop:12},
  card:{flexDirection:'row',padding:10,marginTop:8,borderWidth:0.6,borderColor:'#eee',borderRadius:8,alignItems:'center'},
  title:{fontWeight:'700'},
  btn:{backgroundColor:'#D4AF37',padding:8,borderRadius:8,minWidth:80,alignItems:'center'},
  btnText:{fontWeight:'700'},
  adminBtn:{marginTop:14,alignItems:'center'}
});
