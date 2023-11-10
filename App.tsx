/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

type TodoItemProps = {
  title: string;
};

let todoList: string[] = [];

const TodoItem = ({title}: TodoItemProps) => {
  const [isDone, setIsDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(2)).current;
  const [borderValue, setBorderValue] = useState(2);
  fadeAnim.addListener(({value}) => {
    setBorderValue(value);
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isDone ? 8 : 2,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, isDone]);

  return (
    <View style={[todoStyle.container]}>
      <Pressable onPress={() => setIsDone(!isDone)}>
        <View style={[todoStyle.circle, {borderWidth: borderValue}]} />
      </Pressable>
      <Text>{title}</Text>
    </View>
  );
};

const todoStyle = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    marginRight: 8,
  },
  circleFull: {
    borderWidth: 8,
  },
});

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [todoText, setTodoText] = useState('');

  const addTodo = () => {
    todoList.push(todoText);
    setTodoText('');
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.flexContainer]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {todoList.length > 0 ? (
          <ScrollView>
            {todoList.map(val => (
              <TodoItem title={val} key={val} />
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.flexContainer, styles.headingText]}>
            You have finished all of your todos!
          </Text>
        )}
        <View style={[styles.addSection]}>
          <TextInput
            style={[styles.textInput]}
            placeholder="What's left todo?"
            value={todoText}
            onChange={e => setTodoText(e.nativeEvent.text)}
          />
          <Button title="Add todo" onPress={addTodo} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  flexContainer: {
    flex: 1,
  },
  headingText: {
    fontSize: 24,
    textAlign: 'center',
    justifyContent: 'center',
  },
  addSection: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
  },
});

export default App;
