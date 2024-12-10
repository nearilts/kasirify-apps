import React, { useContext, useEffect, useState } from 'react';
import { View, Modal, Text, FlatList, TouchableOpacity, Button, ScrollView,Alert , TextInput } from 'react-native';
import useFetchData from '../../../utils/useFetchData';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../../const/styles';
import { FloatingButton } from '../../../component/FloatingButton';
import COLORS from '../../../const/color';
import { AuthContext } from '../../../context/AuthContext';
import { formatNumber, formatPrice } from '../../../utils/Helper';
import useDeleteData from '../../../utils/useDeleteData';
import useFetchDataPage from '../../../utils/useFetchDataPage';
import BarcodeScanner from '../../../component/BarcodeScanner';
import BukaKasir from './BukaKasir';
import CategoryItem from '../../../component/CategoryItem';
import ProductItem from '../../../component/ProductItem';
import Toast from 'react-native-simple-toast';
import usePostData from '../../../utils/usePostData';
import Icon from 'react-native-vector-icons/MaterialIcons'
import PaymentList from '../../../component/PaymentList';

const KeranjangScreen = ({ navigation  }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [formData, setFormData] = useState({
    payment_type: 'Cashdrawer',
    snap_token: '',
    amount: '',
    discount_type: '',
    discount: '',
    amount_discount: '',
    total_amount: '',
    amount_paid: '',
    amount_remaining: '',
    tempo: '',
    hari: '',
  });
  const { datas: Datacart, isLoading:loadingcart,refetch:cekCartLagi  } = useFetchData(navigation, 'transaksi/list-cart');
  const { datas: DataPayment, isLoading:loadingPaymentt,refetch:cekPaymentt, fetchMore  } = useFetchDataPage(navigation, 'duitku/get_payment','&amount=0');

  useEffect(() => {
    if (Datacart) {
        cekPaymentt(`&amount=${Datacart.data.sub_total_amount}`); 

        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, 
                amount: formatNumber(Datacart.data.sub_total_amount),
                total_amount: formatNumber(Datacart.data.sub_total_amount)

             };
            console.log('Updated FormData:', updatedFormData);
            return updatedFormData;
          });
    } 
  }, [Datacart]);
  const { postData, isLoading:postdata } = usePostData();

  const renderItem = ({ item }) => (
    <ProductItem
        item={item}
        onPress={(id, qty) => handleDeleteCart(id, qty)}
         color={COLORS.red}
        icon="delete"
        onUpdate={(id, qty) => handleAddCart(id, qty)}
      />
  );

  const handlePostAddcart = async (id, qty) => {
    try {
      const response = await postData('transaksi/add-cart', {product_id : id, qty: qty});
      if (response.meta?.code === 200) {
        Toast.show('Berhasil ditambahkan ke Keranjang.');
        cekCartLagi()
       
        
      } else {
        Toast.show(response.data?.messages);
        cekCartLagi()
      }
    } catch (error) {
      Toast.show('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handlePostdestroycart = async (id, qty) => {
    try {
      const response = await postData('transaksi/destroy-cart', {product_id : id, qty: qty});
      if (response.meta?.code === 200) {
        Toast.show('Berhasil menghapus Keranjang.');
        cekCartLagi()
       
        
      } else {
        Toast.show(response.data?.messages);

      }
    } catch (error) {
      Toast.show('Terjadi kesalahan saat menyimpan data.');
    }
  };
  const handleAddCart = (id, qty) => {
    console.log(' ID:', id); 
    console.log(' qty:', qty); 
    if (qty === 0) {
        handlePostdestroycart(id, qty)

    }else{
        handlePostAddcart(id, qty)
    }
    
    
   
  };

  
const handleDeleteCart = (id, qty) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Apakah Anda yakin ingin menghapus ${qty} item dari keranjang?`, 
      [
        {
          text: 'Batal',
          onPress: () => {
            Toast.show('Batal Menghapus Keranjang.');
          }, 
          style: 'cancel',
        },
        {
          text: 'Hapus', 
          onPress: () => {
            handlePostdestroycart(id, qty);
          },
        },
      ]
    );
  };




  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const handleCategory = (id) => {
    console.log('Selected Category ID:', id); 
    setFormData((prevFormData) => {
        const updatedFormData = { ...prevFormData, 
            snap_token: id,

         };
        return updatedFormData;
      });
    setSelectedCategory(id);
  };
  const rendercategory = ({ item }) => (
    <PaymentList
      item={item}
      selectedCategory={selectedCategory}
      onSelect={(id) => handleCategory(id)}
    />
  );



  const calculateDiscount = (amount, discountType, discount) => {
    if (!amount || !discount) return '0';
    const parsedAmount = parseFloat(amount.replace(/,/g, '')) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
  
    if (discountType === 'persen') {
      return String((parsedAmount * parsedDiscount) / 100);
    } else {
      return String(parsedDiscount);
    }
  };
  
  const handleInputChange = (key, value) => {
    setFormData((prevFormData) => {
      let newFormData = { ...prevFormData, [key]: value };
  
      if (key === 'discount' || key === 'discount_type') {
        const diskon = parseFloat(newFormData.discount.replace(/,/g, ''));
     
        const discountAmount = calculateDiscount(newFormData.amount, newFormData.discount_type, diskon);
        newFormData.amount_discount = formatNumber(discountAmount);
        newFormData.discount = isNaN(diskon) ? '' :String(formatNumber(diskon));
      }
  
      // Total Harga = amount - amount_discount
      if (key === 'amount' || key === 'discount' || key === 'discount_type') {
        const diskon = parseFloat(newFormData.amount_discount.replace(/,/g, ''));
        const totalAmount = parseFloat(newFormData.amount.replace(/,/g, '')) - parseFloat(diskon);
        newFormData.total_amount = isNaN(totalAmount) ? '' : String(formatNumber(totalAmount));
      }
      
      if (key === 'amount_paid' || key === 'total_amount') {
        const change =  parseFloat(newFormData.total_amount.replace(/,/g, '')) - parseFloat(newFormData.amount_paid.replace(/,/g, '')) ;
        newFormData.amount_remaining = isNaN(change) ? '' : String(formatNumber(change));
        const paid = parseFloat(newFormData.amount_paid.replace(/,/g, ''));
        newFormData.amount_paid = isNaN(paid) ? '' :String(formatNumber(paid));
      }
  
      return newFormData;
    });
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setFormData((prevFormData) => {
        const updatedFormData = { 
            ...prevFormData, 
            payment_type: method,
            ...(method === 'Gateway' && { amount_paid: prevFormData.total_amount, amount_remaining: '0' })
        };

        console.log('Updated FormData:', updatedFormData);
        return updatedFormData;
    });
};


const handlePayment = async () => {
    const cleanedData = {
        ...formData,
        discount: formData.discount.replace(/,/g, ''),
        amount_discount: formData.amount_discount.replace(/,/g, ''),
        amount: formData.amount.replace(/,/g, ''),
        amount_paid: formData.amount_paid.replace(/,/g, ''),
        amount_remaining: formData.amount_remaining.replace(/,/g, ''),
        total_amount: formData.total_amount.replace(/,/g, ''),
    };

    // Jika ingin mengonversi ke angka (optional)
    cleanedData.amount = Number(cleanedData.amount);
    cleanedData.amount_paid = Number(cleanedData.amount_paid);
    cleanedData.amount_remaining = Number(cleanedData.amount_remaining);
    cleanedData.total_amount = Number(cleanedData.total_amount);

    console.log(cleanedData);
    handlePaymentPost(cleanedData);
  };

  const handlePaymentPost = async (cleanedData) => {
    try {
      const response = await postData('transaksi', cleanedData);
      if (response.meta?.code === 200) {
        Toast.show('Transaksi Berhasil.');
       
        navigation.replace('PaymentScreen', response.data);
      } else {
        Alert.alert('Gagal',response.data?.messages);
      }
    } catch (error) {
      Toast.show('Terjadi kesalahan saat menyimpan data.');
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
      {Array.isArray(Datacart?.data?.data) && Datacart.data?.data.length > 0 ? (
          <>
            <View style={{marginTop:20}}>
            <FlatList
              data={Datacart?.data?.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 20,
              }}
            />
           
            </View>
          </>
        ) : (
          <View style={styles.container}>
            <Text style={styles.loadingText}>Tidak Ada Keranjang, Buat Keranjang Baru</Text>
            
          </View>
        )}
        <View style={[styles.container,{marginBottom:10, marginTop:20}]}>
            <View style={[styles.card90]}>

            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Sub Total</Text>
                <TextInput
                      placeholderTextColor={COLORS.dark}
                    editable={false}
                    style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                    placeholder="Sub Total"
                    value={String(formData.amount)}
                    onChangeText={(value) => handleInputChange('amount', value)}
                    keyboardType="number-pad"
                />
            </View>


            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Tipe Diskon</Text>
                <View style={{ margin: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity
                    style={[
                        styles.card,
                        { backgroundColor: formData.discount_type === 'persen' ? COLORS.primary : COLORS.grey, marginTop:20 },
                    ]}
                    onPress={() => handleInputChange('discount_type', 'persen')}
                    >
                    <Text style={{ color: COLORS.white }}>Persen (%)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={[
                        styles.card,
                        { backgroundColor: formData.discount_type === 'rupiah' ? COLORS.primary : COLORS.grey, marginTop:20 },
                    ]}
                    onPress={() => handleInputChange('discount_type', 'rupiah')}
                    >
                    <Text style={{ color: COLORS.white }}>Rupiah (Rp)</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Diskon</Text>
                <TextInput
        placeholderTextColor={COLORS.dark}
                    style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                    placeholder="Diskon"
                    value={formData.discount}
                    onChangeText={(value) => handleInputChange('discount', value)}
                    keyboardType="number-pad"
                />
            </View>
            {/* total ptongan hitungannya 
                
                jika tipe persen maka amount * persen/100
                
                jika rupiah langsung nominal discount pindah ke total potongan)
            */}
            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Total Potongan</Text>
                <TextInput
        placeholderTextColor={COLORS.dark}
                    style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                    placeholder="Total Potongan"
                    value={formData.amount_discount}
                    onChangeText={(value) => handleInputChange('amount_discount', value)}
                    keyboardType="number-pad"
                />
            </View>

            
            
            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Metode Bayar</Text>
                <View style={{ margin: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {['Cashdrawer', 'Gateway', 'Credit'].map((method) => (
                    <TouchableOpacity
                        key={method}
                        style={[
                        styles.card,
                        { backgroundColor: formData.payment_type === method ? COLORS.primary : COLORS.grey, marginTop:20  },
                        ]}
                        onPress={() => handlePaymentMethodSelect( method)}
                    >
                        <Text style={{ color: COLORS.white }}>{method}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
                </View>

            </View>

            {/* Total Harga = amount - amount_discount */}
            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Total Harga</Text>
                <TextInput
        placeholderTextColor={COLORS.dark}
                    editable={false}
                    style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                    placeholder="Total Harga"
                    value={formData.total_amount}
                    onChangeText={(value) => handleInputChange('total_amount', value)}
                    keyboardType="number-pad"
                />
            </View>

            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Total Bayar</Text>
                <TextInput
        placeholderTextColor={COLORS.dark}
                    style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                    placeholder="Total Bayar"
                    value={formData.amount_paid}
                    onChangeText={(value) => handleInputChange('amount_paid', value)}
                    keyboardType="number-pad"
                />
            </View>

            {/* Kembalian = total_amount - amount_paid */}

            <View style={{margin:10}}>
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Kembalian</Text>
                <TextInput
        placeholderTextColor={COLORS.dark}
                    style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                    placeholder="Kembalian"
                    value={formData.amount_remaining}
                    onChangeText={(value) => handleInputChange('amount_remaining', value)}
                    keyboardType="number-pad"
                    editable={false}
                />
            </View>
            

            {/* Payment Gateway tampilkan jika Metode Pembayaran == Gateway  */}
            {selectedPaymentMethod  === 'Gateway' && (
            <View style={{margin:10}}>
            
                <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Payment Gateway</Text>
                <FlatList
                    data={DataPayment?.data?.paymentFee}
                    renderItem={rendercategory}
                    keyExtractor={(item) => item.paymentMethod.toString()}
                    horizontal={true}
                    />
            </View>
            )}
            

            {/* Payment Gateway tampilkan jika Metode Pembayaran == Gateway  */}
            {selectedPaymentMethod  === 'Credit' && (
                <>
                <View style={{margin:10}}>
                    
                    <Text style={{color:COLORS.dark, fontWeight:'bold'}}>Jumlah Cicilan (x)</Text>
                    <TextInput
        placeholderTextColor={COLORS.dark}
                        style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                        placeholder="Jumlah Cicilan "
                        value={formData.tempo}
                        onChangeText={(value) => handleInputChange('tempo', value)}
                        keyboardType="number-pad"
                    />
                </View>

                <View style={{margin:10}}>
                
                    <Text style={{color:COLORS.dark, fontWeight:'bold'}}> Per Hari</Text>
                    <TextInput
        placeholderTextColor={COLORS.dark}
                        style={[styles.input,{fontWeight:'bold', color:COLORS.dark}]}
                        placeholder="isi (30) jika 30 hari pertempo bayar "
                        value={formData.hari}
                        onChangeText={(value) => handleInputChange('hari', value)}
                        keyboardType="number-pad"
                    />
                </View>
                
                </>

            )}

            
        </View>
        </View>
       
       
      </ScrollView>
            <TouchableOpacity  style={[styles.loadMoreButton, {flexDirection:'row', justifyContent:'center'}]} onPress={() => handlePayment()}>
            <Icon name="shopping-cart" size={22} color={COLORS.white} />
              <Text style={styles.loadMoreText}>
                Bayar ({Datacart?.data.sub_total_qty}) - (Rp. {(formData.total_amount)})
              </Text>
            </TouchableOpacity>
    </View>
  );
};

export default KeranjangScreen;
