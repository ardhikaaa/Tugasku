import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AntDesign, Entypo, FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker';
import { green } from 'react-native-reanimated/lib/typescript/Colors'

const index = () => {
  const [task, setTask] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);


  const addTask = () => {
    if(task.trim() === '') {
      Alert.alert('Duh', 'Belom Kamu Isi');
      return;
    }

    if(task.trim().length < 3){
      Alert.alert('Huh', 'Yang bener kamu inputnya');
      return;
    }

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
    Alert.alert(
      'Yakin Mau Hapus?',
      'Tugas ini akan dihapus secara permanen.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', onPress: () => {
          const filtered = list.filter(item => item.id !== id);
          setList(filtered);
        }, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };
  

  const handleEdit =() => {
    const updated = list.map(item =>
      item.id === editId
      ? {...item, title: title.trim(), desc: task.trim(), deadline: deadline.trim(), category: category}
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

      <View style={tw`gap-2 mb-2`}>
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
        style={tw`bg-[#032A4E]  p-3 rounded-lg w-full items-center`}
        onPress={isEditing ? handleEdit : addTask}>
          <Text style={tw`text-white text-lg`}>{isEditing ? 'Simpan' : 'Tambah'}</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`my-4`}>
        {list.length === 0 ? (
          <Text style={tw`text-center text-neutral-400 text-lg italic font-semibold`}>YEAY GADA TUGAS KAMU</Text>
        ) : (
          <Text style={tw`text-neutral-600 text-lg font-semibold`}>ADA TUGAS NI KAMU!</Text>
        )}
      </View>

      <FlatList 
        data={list}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
      <View style={tw`border border-neutral-500 rounded-xl p-1 flex-row justify-between my-1`}>
        <View style={tw`flex-row gap-2`}>
          <View style={tw`justify-center`}>
          <TouchableOpacity onPress={() => toggleCheck(item.id)}>
            {item.checked ? (
              <FontAwesome name='check-square' size={28} color={'green'} />
            ) : (
              <FontAwesome name='square-o' size={30} color={'gray'} />
            )}
          </TouchableOpacity>
          </View>
          <View>
            <Text style={tw`text-xl font-bold ${item.checked ? 'line-through text-gray-400' : ''}`}>
              📖 {item.title}
            </Text>
            <Text style={tw`text-lg font-small ${item.checked ? 'line-through text-gray-400' : ''}`}>
              📋 {item.desc}
            </Text>
            <Text style={tw`text-lg text-red-500 font-bold ${item.checked ? 'line-through text-gray-400' : ''}`}>
              ⏳ {item.deadline}
            </Text>
            <Text  style={tw`text-lg text-grey-500 ${item.checked ? 'line-through text-gray-400' : ''}`}>
              📌 {item.category}</Text>
          </View>
        </View>

        <View style={tw`flex-row gap-1 items-center`}>
        <TouchableOpacity 
          onPress={() => {
            if (!item.checked) {
              startEdit(item);
            }
            else {
              alert("Tugas ini sudah selesai dan tidak bisa diedit.");
            }
          }}
        >
          <MaterialIcons name='edit-square' size={30} style={[tw`text-[#032A4E]`, item.checked && tw`text-gray-400`]}/>
        </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Entypo name='squared-cross' size={30} color={'red'}/>
          </TouchableOpacity>
        </View>
      </View>
      )}
    />
    </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default index