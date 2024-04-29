import { View, StyleSheet, TextInput, Button, SafeAreaView,Text,FlatList, TouchableOpacity} from 'react-native';
import React, { useState ,useEffect} from 'react';
import {db} from '../firebaseConnection';
import { collection, addDoc ,getDocs,deleteDoc,updateDoc,doc,} from 'firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import ProgressBar from 'react-native-progress/Bar';



const Homescreen = () => {
	const [todos, setTodos] = useState([]);
	const [todo, setTodo] = useState('');
	const [editId, setEditId] = useState(null);
	const [updatedTodo, setUpdatedTodo] = useState('');
	const [checkedItems, setCheckedItems] = useState({});


	useEffect(() => {
		// Fetch todo items from Firestore when component mounts
		const fetchTodos = async () => {
		  try {
			const querySnapshot = await getDocs(collection(db, 'todos'));
			
			const todosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setTodos(todosData);

			console.log('Fetched todos:', todosData);
			
		  } catch (error) {
			console.error('Error fetching todos:', error);
			alert('Failed to fetch todos. Please try again later.');
		  }
		};
	
		fetchTodos();
	
		// Clean up function to unsubscribe from Firestore listener when component unmounts
		return () => {};
	  }, []); // Run effect only once when component mounts

	const addTodo = async () => {
		try {
			if (!todo.trim()) {
			  return; // Don't add empty todos
			}
	  
			// Add todo to Firestore collection
			const docRef = await addDoc(collection(db, 'todos'), { todo });
	  
			// Clear todo input after adding
			setTodos(prevTodos => [...prevTodos, { id: docRef.id, todo }]);

			setTodo('');
	  
			// Optionally, display success message
			alert('Todo added successfully');
		  } catch (error) {
			console.error('Error adding todo:', error);
			alert('Failed to add todo. Please try again later.');
		  }
	};

	const deleteTodo = async (id) => {
		try {
		  await deleteDoc(doc(db, 'todos', id));
		  setTodos(todos.filter(todo => todo.id !== id));
		  alert('Todo deleted successfully');
		} catch (error) {
		  console.error('Error deleting todo:', error);
		  alert('Failed to delete todo. Please try again later.');
		}
	  };

	  const updateTodo = async (id, updatedTodo) => {
		try {
		  await updateDoc(doc(db, 'todos', id), { todo: updatedTodo });
		  const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
			  return { ...todo, todo: updatedTodo };
			}
			return todo;
		  });
		  setTodos(updatedTodos);
		  setEditId(null); // Clear edit mode
		  alert('Todo updated successfully');
		} catch (error) {
		  console.error('Error updating todo:', error);
		  alert('Failed to update todo. Please try again later.');
		}
	  };
	
	  const handleUpdate = (id, currentTodo) => {
		setUpdatedTodo(currentTodo); // Set the current todo value in the state
		setEditId(id); // Set the edit mode for the specified todo
	  };

	  const toggleCheckbox = (id) => {
		setCheckedItems({
		  ...checkedItems,
		  [id]: !checkedItems[id]
		});
	  };

	  const totalTodos = todos.length;
	  const completedTodos = Object.values(checkedItems).filter(item => item).length;
	  const progress = totalTodos === 0 ? 0 : completedTodos / totalTodos;
	

	  
	
	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Add new todo"
					onChangeText={(text) => setTodo(text)}
					value={todo}
				/>
				<Button onPress={addTodo} title="Add Todo" disabled={todo === ''} />
			</View>
			<View style={styles.progressContainer}>
			<ProgressBar progress={progress} width={200} color={'blue'} />
      <View style={styles.box}>
        <Text style={styles.boxText}>Completed</Text>
        <View style={[styles.colorBox, { backgroundColor: 'blue' }]}></View>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxText}>In Progress</Text>
        <View style={[styles.colorBox, { backgroundColor: 'white' }]}></View>
      </View>
    </View>
			<FlatList
        data={todos}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
			<CheckBox
              value={checkedItems[item.id]}
              onValueChange={() => toggleCheckbox(item.id)}
            />
		  
            {editId === item.id ? (
              <>
                <TextInput
                  style={styles.editInput}
                  onChangeText={(text) => setUpdatedTodo(text)}
                  value={updatedTodo}
                />
                <TouchableOpacity onPress={() => updateTodo(item.id, updatedTodo)} style={styles.button}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text>{item.todo}</Text>
				{!checkedItems[item.id]&&(
					  <TouchableOpacity onPress={() => handleUpdate(item.id, item.todo)} style={styles.button}>
					  <Text>Update</Text>
					</TouchableOpacity>
				)}
              
                <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.button}>
                  <Text>Delete</Text>
                </TouchableOpacity>
				
              </>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 20
	},
	form: {
		marginVertical: 20,
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		backgroundColor: '#fff'
		
	},
	todoItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	  },
	  button: {
		padding: 10,
		backgroundColor: 'lightblue',
		borderRadius: 5,
	  },
	  editInput: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		backgroundColor: '#fff',
		marginBottom: 10,
	  },
	  progressContainer: {
		alignItems: 'center',
		marginBottom: 20
	  },
	  box: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	  },
	  boxText: {
		marginRight: 10
	  },
	  colorBox: {
		width: 20,
		height: 20
	  },
});

export default Homescreen;