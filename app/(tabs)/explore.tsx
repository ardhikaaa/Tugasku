import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker';

const index = () => {
  const [task, setTask] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);


  const addTask = () => {
    if(task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      desc: task.trim(),
      deadline: deadline.trim(),
      checked: false,
      category: category,
    };

    setList([...list, newTask]);
    setTask('');
    setTitle('');
    setDeadline('');
    setCategory('');
  }

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Berhasil simpan data');
    } catch (error) {
      console.log('Gagal simpan', error);
    }
  }

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log('Berhasil load data');
      }
    } catch (error) {
      console.log('Gagal load', error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);
  
  useEffect(() => {
    saveTasks();
  }, [list]);

  const deleteTask = (id: string) => {
    const filtered = list.filter(item => item.id !== id);
    setList(filtered);
  };

  const handleEdit =() => {
    const updated = list.map(item =>
      item.id === editId
      ? {...item, title: title.trim(), desc: task.trim(), deadline: deadline.trim()}
      :item
    );
    setList(updated);
    setTitle('');
    setTask('');
    setDeadline('');
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item: any) => {
    setTitle(item.title);
    setTask(item.desc);
    setDeadline(item.deadline);
    setIsEditing(true);
    setEditId(item.id)
  }

  const toggleCheck = (id: string) => {
    const updated = list.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setList(updated);
  };

  return (
    <SafeAreaView>
      <ScrollView>
    <View style={tw`mx-3 my-5`}>
        <Text style={tw`text-2xl font-semibold mb-3`}>📚 Task</Text>

      <View style={tw`gap-2 mb-5`}>
        <TextInput
            style={tw`border border-neutral-400 rounded-lg w-full`}
            placeholder='Add Title'
            value={title}
            onChangeText={setTitle}
          />

        <TextInput 
        style={tw`border border-neutral-400 rounded-lg w-full`} 
        placeholder='Add Task' 
        value={task} 
        onChangeText={setTask}>
        </TextInput>

        <TextInput
            style={tw`border border-neutral-400 rounded-lg w-full`}
            placeholder='Deadline'
            value={deadline}
            onChangeText={setDeadline}
          />

        <View style={tw`border border-neutral-400 rounded-lg w-full mb-2`}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={tw`w-full`}
          >
            <Picker.Item label="Choose Category" style={tw`text-neutral-500`} value="" />
            <Picker.Item label="Homework" value="PR" />
            <Picker.Item label="Project" value="Proyek" />
            <Picker.Item label="Exam" value="Ujian" />
          </Picker>
        </View>

        <TouchableOpacity 
        style={tw`bg-blue-400  p-3 rounded-lg w-full items-center`}
        onPress={isEditing ? handleEdit : addTask}>
          <Text style={tw`text-white text-lg`}>{isEditing ? 'Simpan' : 'Tambah'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={list}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => toggleCheck(item.id)}
          style={tw.style(
            'flex-row justify-between border-2 w-full my-2 p-2 rounded-xl',
            item.checked ? 'bg-gray-300 border-gray-500' : 'bg-white border-neutral-400'
          )}
        >
      <View>
        <Text style={tw.style('text-lg', item.checked && 'line-through text-gray-500')}>
          📖 {item.title}
        </Text>
        <Text style={tw.style('text-lg', item.checked && 'line-through text-gray-500')}>
          📋 {item.desc}
        </Text>
        <Text style={tw.style('text-lg', item.checked && 'line-through text-gray-500')}>
          ⏳ {item.deadline}
        </Text>
        <Text  style={tw.style('text-lg', item.checked && 'line-through text-gray-500')}>
          📌 {item.category}</Text>

        <View style={tw`flex-row gap-2 items-center`}>
        <TouchableOpacity 
          onPress={() => {
            if (!item.checked) {
              startEdit(item);
            } else {
              alert("Tugas ini sudah selesai dan tidak bisa diedit.");
            }
          }}
        >
          <Text style={[tw`text-blue-500 text-[5] font-semibold`, item.checked && tw`text-gray-400`]}>Edit</Text>
        </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Text style={tw`text-red-500 text-[5] font-semibold`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

        <Image source={
          item.checked
            ? require('@/assets/images/checked.png')
            : require('@/assets/images/book.png')} 
        style={tw`w-25 h-25`} />
      </TouchableOpacity>
      )}
    />
    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default index