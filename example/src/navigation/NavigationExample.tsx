import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Button from '../components/button';
import ContactListContainer from '../components/contactListContainer';
import withModalProvider from '../screens/withModalProvider';
import createBottomSheetNavigator from './createBottomSheetNavigator';
import { useNavigation } from '@react-navigation/native';

const SimpleExample = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { navigate, goBack } = useNavigation();

  // callbacks
  const handleChange = useCallback((index: number) => {
    console.log('index', index);
  }, []);
  const handleDismiss = useCallback(() => {
    console.log('on dismiss');
  }, []);

  // renders
  return (
    <View style={styles.container}>
      <Button
        label="Navigate to B"
        style={styles.buttonContainer}
        onPress={() => navigate("ScreenB")}
      />
      <Button
        label="Back"
        style={styles.buttonContainer}
        onPress={goBack}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['25%', '50%']}
        animationDuration={250}
        onDismiss={handleDismiss}
        onChange={handleChange}
      >
        <ContactListContainer title="Modal FlatList" type="FlatList" />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 6,
  },
});

const Stack = createBottomSheetNavigator();


function NavigationExample() {
  return (
    <Stack.Navigator screenOptions={{  }} headerMode="screen">
      <Stack.Screen
        name="ScreenA"
        options={{  }}
        component={SimpleExample}
      />
      <Stack.Screen
        name="ScreenB"
        options={{  }}
        component={SimpleExample}
      />
      {/*<Stack.Screen name="ScreenB" component={ScreenB} />*/}
      {/*<Stack.Screen name="ScreenC" component={ScreenC} />*/}
      {/*<Stack.Screen name="ScreenD" component={ScreenD} />*/}
    </Stack.Navigator>
  )
}

export default withModalProvider(NavigationExample);
