import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'

const index = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleCheck = (id: string) => {
    const updatedList = list.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setList(updatedList);
  };

  const addTask = () => {
    if(task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      checked: false,
    };

    setList([...list, newTask]);
    setTask('');
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
      ? {...item, title: task.trim()}
      :item
    );
    setList(updated);
    setTask('');
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item: any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id)
  }

  return (
    <SafeAreaView>
     <View style={tw`bg-yellow-300 h-35 rounded-b-[10]`}></View>
    <View style={tw`mx-3 my-3`}>
      <View style={tw`flex-row gap-3 mb-2`}>
        <FontAwesome5 name="user-alt" size={30}/>
        <Text style={tw`text-2xl font-bold`}>Personal</Text>
      </View>
      <View style={tw`flex-row justify-between`}>

        <TextInput 
        style={tw`border border-neutral-400 rounded-lg w-68`} 
        placeholder='Tambahkan Tugas...' 
        value={task} 
        onChangeText={setTask}>
        </TextInput>

        <TouchableOpacity 
        style={tw`bg-blue-400 p-3 rounded-lg w-25 items-center`}
        onPress={isEditing ? handleEdit : addTask}>
          <Text style={tw`text-white text-lg`}>{isEditing ? 'Simpan' : 'Tambah'}</Text>
        </TouchableOpacity>
      </View>
        <FlatList
              data={list}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={tw`flex-row items-center justify-between`}>
                  <View style={tw`flex-row`}>
                  <TouchableOpacity onPress={() => handleCheck(item.id)}>
                    {item.checked ? (
                      <MaterialCommunityIcons name='checkbox-marked' size={30} color="black" />
                    ) : (
                      <MaterialCommunityIcons name='checkbox-blank-outline' size={30} color="black" />
                    )}
                  </TouchableOpacity>
                  <Text style={tw`text-lg ${item.checked ? 'line-through text-gray-400' : ''}`}>{item.title}</Text>
                  </View>
                  <View style={tw`flex-row gap-2 items-center`}>
                    <TouchableOpacity onPress={()=> startEdit(item)}>
                      <Text style={tw`text-blue-500`}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(item.id)}>
                    <FontAwesome name='window-close' size={30} color={'red'}/>
                    </TouchableOpacity>
                  </View>
                </View>
              )}/>
    </View>
    </SafeAreaView>
  )
}

export default index