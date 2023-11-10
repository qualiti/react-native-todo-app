import React, {useMemo} from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  Animated,
  View,
  Pressable,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export type TodoItem = {
  identifier: string;
  title: string;
  done: boolean;
  createdAt: Date;
};

export type TodoItemProps = {
  title: string;
  done: boolean;
  updateDone: (done: boolean) => void;
};

const TodoItem = ({title, done, updateDone}: TodoItemProps) => {
  const fadeAnim = useRef(new Animated.Value(2)).current;
  const [borderValue, setBorderValue] = useState(2);
  fadeAnim.addListener(({value}) => {
    setBorderValue(value);
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: done ? 8 : 2,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, done]);

  return (
    <View style={[todoStyle.container]}>
      <Pressable onPress={() => updateDone(!done)}>
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

export type TodoListProps = {
  items: TodoItem[];
  setItemDone: (identifier: string, done: boolean) => void;
};

const TodoList = ({items, setItemDone}: TodoListProps) => {
  const sortedList = useMemo(
    () =>
      items.sort((a, b) => {
        return a.createdAt.valueOf() - b.createdAt.valueOf();
      }),
    [items],
  );

  return (
    <ScrollView>
      {sortedList.map(val => (
        <TodoItem
          title={`${val.title}`}
          key={val.identifier}
          done={val.done}
          updateDone={done => setItemDone(val.identifier, done)}
        />
      ))}
    </ScrollView>
  );
};

export default TodoList;
