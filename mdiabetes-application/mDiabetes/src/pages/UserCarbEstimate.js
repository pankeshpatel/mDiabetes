import React, {useState, useEffect} from 'react';
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  Title,
  Subheading,
  IconButton,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, ScrollView} from 'react-native';

export default function UserCarbEstimate({route, navigation}) {
  let foodLog = route.params.foodLog;
  const [foodItem, setFoodItem] = useState([]);

  useEffect(() => {
    setFoodItem(
      foodLog.map((val, indx) => {
        let a = {
          item: val.name,
          quantity: val.quantity + ' ' + val.units,
          'cho-est': '',
        };
        val = a;
        return val;
      }),
    );
  }, []);

  const handleChoEst = (v, i) => {
    setFoodItem(
      foodItem.map((val, index) => {
        if (i == index) {
          val['cho-est'] = v;
          return val;
        } else {
          return val;
        }
      }),
    );
  };

  const handleNext = () => {
    navigation.navigate('LogFood', {
      fooditem: foodItem,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <View>
          <Text style={styles.heading}>
            Please enter your carbohydrate estimates in gms.
          </Text>
        </View>
        {Object.entries(foodLog).map(([key, val], index) => {
          return (
            <>
              <View style={styles.flexDisplay}>
                <View style={{width: 100}}>
                  <Text>
                    {val.quantity +
                      ' ' +
                      val.units +
                      ' ' +
                      'of' +
                      ' ' +
                      val.name}{' '}
                  </Text>
                </View>
                <View>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      height: 28,
                      backgroundColor: 'lightgrey',
                      color: 'black',
                      flex: 0.91,
                      width: 60,
                    }}
                    onChangeText={value => {
                      handleChoEst(value, index);
                    }}></TextInput>
                </View>
                <View>
                  <Text>gms</Text>
                </View>
              </View>
            </>
          );
        })}
        <Text></Text>
        <Button mode="contained" onPress={handleNext}>
          {' '}
          NEXT{' '}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  root: {
    padding: 20,
    width: '100%',
    height: '100%',
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
  },
  flexDisplay: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
  },
};
