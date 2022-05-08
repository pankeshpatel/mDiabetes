import React from 'react';
import {useState, useRef, useEffect} from 'react';
import {View, Image, Text, Pressable} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackgroundImg from '../assets/green-background.jpg';
import DayView from '../components/DayView';
import SelectDropdown from 'react-native-select-dropdown';

import {BASE_VOLUME_ESTIMATION_SERVER} from '@env';
export const VOLUME_ESTIMATION_SERVER = `${BASE_VOLUME_ESTIMATION_SERVER}`;

// NONE AT BOTTOM OF LIST - BACKEND
export default function ColorMap({route, navigation}) {
  // console.log("params",route.params)

  let food = route.params.food;
  let colors = route.params.colors;
  let foodItems = route.params.foodItems;
  let volume = route.params.volume;

  const [colorIndex, setColorIndex] = useState([]);

  useEffect(() => {
    setColorIndex(
      colors.map((val, ind) => {
        let a = {item: [], color: ''};
        val = a;
        return val;
      }),
    );
  }, []);

  const handleColorIndex = (item, index) => {
    setColorIndex(
      colorIndex.map((val, ind) => {
        if (index == ind) {
          val.item.push(item);
          val.color = colors[index];

          return val;
        } else {
          return val;
        }
      }),
    );
  };

  let foodCarbMap = {};

  // console.log("routes",route.params.image)
  const handleSumbit = () => {
    console.log("submitted",VOLUME_ESTIMATION_SERVER)
    let body = new FormData();
    body.append('food', JSON.stringify(food));
    body.append('volume', JSON.stringify(volume));
    body.append('bbox-matches', JSON.stringify(colorIndex));

    let header = {'Content-Type': 'multipart/form-data'};
    fetch(VOLUME_ESTIMATION_SERVER + 'api2', {
      method: 'POST',
      header: header,
      body: body,
    })
      .then(res => res.json())
      .then(res => {
        console.log('res2', res);

        //   setScreen2(false)

        navigation.navigate('VolumeEstimation', {
          userEstimate: res.choUser,
          estimateWithImage: res.choWithImage,
          estimateWithOutImage: res.choWithoutImage,
        });
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {/* <img src={route.params.image} alt="" /> */}
        <Image
          style={{width: 300, height: 300, margin: 25}}
          source={{uri: route.params.image}}
        />

        {
          //    Object.keys(colors).map((value)=>{
          colors.map((value, i) => {
            return (
              <View
                key={Math.random(0, 10000000)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 40,
                  justifyContent: 'space-around',
                }}>
                <View style={{width: 180}}>
                  {/* <Text style={styles.sectionDescription} >{value.charAt(0).toUpperCase() + value.slice(1)}</Text>  */}
                  <Text style={styles.sectionDescription}>{value}</Text>
                </View>
                <View>
                  <SelectDropdown
                    data={foodItems}
                    buttonStyle={{
                      width: 200,
                      borderWidth: 1,
                      height: 30,
                      marginTop: 15,
                    }}
                    onSelect={(selectedItem, index) => {
                      handleColorIndex(selectedItem, i);
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      return (
                        <Text style={{color: 'black'}}>
                          {' '}
                          {colorIndex[i]?.item?.length
                            ? colorIndex[i]?.item?.join(', ')
                            : 'please Select'}
                        </Text>
                      );
                    }}
                    renderDropdownIcon={isOpened => {
                      return (
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/0/159.png',
                          }}
                          style={{width: 20, height: 20}}
                        />
                      );
                    }}
                    dropdownIconPosition={'right'}
                    multiselect
                  />
                </View>
              </View>
            );
          })
        }

        {/* <Image source={BackgroundImg} style={styles.background}/> */}
        {/* <View style={styles.headerTop}>
					<View>
						<Text style={styles.deployment}>Day 1 of 44</Text>
						<Text style={styles.title}>Welcome</Text>
					</View>
					<View style={{ flex: 1}} />
					<IconButton icon="history" onPress={() => {navigation.navigate("History")}} />
					<IconButton icon="logout" onPress={() => {navigation.navigate("PatientLogin")}} />
				</View> */}
        {/* <Text style={styles.smallText}>Foodlogs today: 1</Text> */}
        {/* <Text style={{
					...styles.warning,
					opacity: hasWarning ? 1 : 0
				}}>You have unanswered daily questions.</Text> */}
        {/* <Button
					mode="contained"
					icon="food-fork-drink"
					style={styles.logButton}
					contentStyle={styles.logButtonContent}
					labelStyle={styles.logButtonLabel}
				
					onPress={() => {navigation.navigate("LogFoodIntro")}}
				>
					<Text style={styles.logButtonLabelText}>&nbsp;&nbsp;Log Food</Text>
				</Button> */}

        <Pressable
          style={{
            backgroundColor: 'lightgrey',
            color: 'white',
            width: 100,
            height: 30,
            marginLeft: 260,
            padding: 1,
            borderWidth: 1,
          }}
          onPress={handleSumbit}>
          <Text style={{color: 'black', marginLeft: 25, marginTop: 5}}>
            Submit
          </Text>
        </Pressable>
      </View>
      {/* <DayView /> */}
    </SafeAreaView>
  );
}

const styles = {
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    height: 250,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  headerTop: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  background: {
    height: 300,
    position: 'absolute',
    top: -100,
    left: -20,
    height: 350,
    width: '125%',
  },
  deployment: {
    fontSize: 15,
  },
  smallText: {
    fontSize: 15,
  },
  sectionDescription: {
    marginTop: 10,
    marginLeft: 0,
    marginRight: 20,
    fontSize: 24,
    fontWeight: '600',
  },
  warning: {
    fontSize: 15,
    color: 'red',
    marginTop: 25,
    marginBottom: 5,
  },
  logButton: {
    width: 200,
    marginTop: 10,
    paddingRight: 10,
    height: 75,
    alignSelf: 'center',
  },
  logButtonContent: {
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  logButtonLabel: {
    width: 100,
    fontSize: 35,
  },
  logButtonLabelText: {
    fontSize: 15,
  },
};
