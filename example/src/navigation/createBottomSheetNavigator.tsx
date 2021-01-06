import * as React from 'react';
import { Platform } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  EventArg,
  StackRouter,
  StackRouterOptions,
  StackNavigationState,
  StackActions,
  ParamListBase,
  StackActionHelpers,
} from '@react-navigation/native';
import type {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationEventMap,
} from '@react-navigation/stack/src/types';
import { useEffect, useRef } from 'react';

type Props = DefaultNavigatorOptions<StackNavigationOptions> &
  StackRouterOptions &
  StackNavigationConfig;

function Route({ descriptor }) {
  const ref = useRef<BottomSheetModal>()
  useEffect(() => ref.current?.present(), [])
  return <BottomSheetModal
    ref={ref}
    snapPoints={['25%', '50%']}
    animationDuration={250}
    // ref={bottomSheetRef}
    // onDismiss={handleDismiss}
    // onChange={handleChange}
  >
    {descriptor.render()}
  </BottomSheetModal>
}

function StackView({ descriptors, state, navigation }) {
  console.log(descriptors)
  console.log(state.routes.map(route => descriptors[route.key]))
  const [firstKey, ...restKeys] = state.routes.map(route => route.key)
  const previousKeys = useRef([])
  const closingKeys = useRef([])
  const newKeys = useRef([])

  previousKeys.current = restKeys;
  return (
    <>
      {descriptors[firstKey].render()}
      {restKeys.map(key => (
        <Route descriptor={descriptors[key]} key={key} />
      ))}
     </>

  )

}

function StackNavigator({
                          initialRouteName,
                          children,
                          screenOptions,
                          ...rest
                        }: Props) {
  const defaultOptions = {
    gestureEnabled: Platform.OS === 'ios',
    animationEnabled:
      Platform.OS !== 'web' &&
      Platform.OS !== 'windows' &&
      Platform.OS !== 'macos',
  };

  const { state, descriptors, navigation } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
    >(StackRouter, {
    initialRouteName,
    children,
    screenOptions:
      typeof screenOptions === 'function'
        ? (...args) => ({
          ...defaultOptions,
          ...screenOptions(...args),
        })
        : {
          ...defaultOptions,
          ...screenOptions,
        },
  });

  React.useEffect(
    () =>
      navigation.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as EventArg<'tabPress', true>).defaultPrevented
          ) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key]
  );

  return (
    <StackView
      {...rest}
      state={state}
      descriptors={descriptors}
      navigation={navigation}
    />
  );
}

export default createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof StackNavigator
  >(StackNavigator);
