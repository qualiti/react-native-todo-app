import React, {useEffect, useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import 'react-native-get-random-values';
import {v4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoList, {TodoItem} from './src/TodoList';

function App(): JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [todoText, setTodoText] = useState('');
  const [todoList, setTodoList] = useState<TodoItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('todoList').then(value => {
      setIsLoaded(true);
      if (value) {
        const parsedTodoList = JSON.parse(value);
        if (Array.isArray(parsedTodoList)) {
          setTodoList(parsedTodoList);
        }
      }
    });
  }, []);

  const addTodo = () => {
    setTodoList(current => {
      const newItem = {
        title: todoText,
        identifier: v4(),
        done: false,
        createdAt: new Date(),
      };

      const newList = [...current, newItem];
      AsyncStorage.setItem('todoList', JSON.stringify(newList));
      return newList;
    });
    setTodoText('');
  };

  const setItemDone = (identifier: string, done: boolean) => {
    setTodoList(current => {
      const newList = current.map(item => {
        if (item.identifier === identifier) {
          return {...item, done};
        }
        return item;
      });
      AsyncStorage.setItem('todoList', JSON.stringify(newList));
      return newList;
    });
  };

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.flexContainer]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {todoList.length > 0 ? (
          <TodoList items={todoList} setItemDone={setItemDone} />
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
