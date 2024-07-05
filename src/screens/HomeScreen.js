import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Button, Switch, Text, Appbar } from 'react-native-paper';
import Task from '../components/Task';
import { styles } from './HomeScreenStyle';
import { save, load, update, remove } from '../database/firebaseConfig';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      const loadedTasks = await load();
      setTasks(loadedTasks);
    }
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim() !== '') {
      const newTask = { title: taskTitle, status: taskStatus };
      const id = await save(newTask);
      if (id) {
        setTasks([...tasks, { ...newTask, id }]);
        setTaskTitle('');
        setTaskStatus(false);
      }
    }
  };

  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    const updatedStatus = !task.status;
    const success = await update(taskId, { status: updatedStatus });
    if (success) {
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: updatedStatus } : task));
    }
  };

  const deleteTask = async (taskId) => {
    const success = await remove(taskId);
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="My Todos" />
        </Appbar.Header>
      </View>
      <View style={styles.content}>
        <TextInput
          label="Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
          style={styles.input}
        />
        <View style={styles.statusContainer}>
          <Text>Status: {taskStatus ? 'Done' : 'Due'}</Text>
          <Switch
            value={taskStatus}
            onValueChange={setTaskStatus}
          />
        </View>
        <Button mode="contained" onPress={addTask} disabled={taskTitle.trim() === ''} style={styles.addButton}>
          Add Task
        </Button>
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <Task
              task={item}
              toggleTaskStatus={toggleTaskStatus}
              deleteTask={deleteTask}
            />
          )}
          keyExtractor={item => item.id}
          style={styles.taskList}
        />
      </View>
    </View>
  );
}