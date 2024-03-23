import { useEffect, useState } from 'react';
import { FaPlus, FaPencilAlt, FaPowerOff } from 'react-icons/fa';
import { db, auth } from '../utils/firebaseconfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import TodoList from '../components/TodoList';
import { useNavigate } from 'react-router-dom';

export default function Todo() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [userId, setUserId] = useState(null); // To store the current user's ID

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Signout Successful');
        navigate('/login');
      })
      .catch((error) => {
        console.log('Error in Signout:', error);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User Signed in");
        setUserId(user.uid); 

        // onSnapshot to get real time updates
        const userDocRef = doc(db, 'todos', user.uid);
        const unsub = onSnapshot(userDocRef, (doc) => {
          const userData = doc.data();
          setTodos(userData ? userData.data : []);
        });
        return () => unsub();
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const addTodo = async () => {
    if (input.trim() !== '' && userId) {
      const userDocRef = doc(db, 'todos', userId);
      await updateDoc(userDocRef, {
        data: arrayUnion(input) 
      });
      setInput('');
    }
  };

  const updateTodo = async () => {
    if (input.trim() !== '' && userId !== null && editIndex !== -1) {
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = input; 
      const userDocRef = doc(db, 'todos', userId);
      await updateDoc(userDocRef, { data: updatedTodos });
      setInput('');
      setEditIndex(-1);
    }
  };

  const setEdit = (index) => {
    setInput(todos[index]); 
    setEditIndex(index);
  };

  const removeTodo = async (index) => {
    if (userId !== null) {
      const updatedTodos = [...todos];
      updatedTodos.splice(index, 1);
      const userDocRef = doc(db, 'todos', userId);
      await updateDoc(userDocRef, { data: updatedTodos });
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4 bg-[#121215]">
      <div className="bg-[#18181C] rounded-xl p-4 w-full max-w-2xl lg:w-xl shadow-md">
        <div className='w-full flex justify-between'>
          <h1 className="text-4xl text-teal-400 font-semibold mb-4">
            Vibe
            <span className="text-white">List</span>
          </h1>
          <FaPowerOff className='text-zinc-200 opacity-60 h-8 w-8  hover:opacity-100' onClick={handleSignOut} />
        </div>
        <div className="flex gap-4 shadow-md">
          <input type="text"
            placeholder="Add a todo"
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            className="py-2 px-4 w-full rounded-lg bg-[#302D36] focus:outline-none caret-slate-100 font-medium text-[#F5F8FF]"/>
          <button onClick={editIndex === -1 ? addTodo : updateTodo} 
            className="font-medium text-[#F5F8FF] bg-teal-400  hover:bg-[#84849D] px-4 py-2 rounded-lg">
            {editIndex === -1 ? <FaPlus /> : <FaPencilAlt />}
          </button>
        </div>
      </div>
      {todos.length > 0 && (
        <TodoList todos={todos.map((todo, index) => ({ id: index.toString(), todo }))}
                  setEdit={setEdit} 
                  removeTodo={removeTodo}/>
      )}
    </div>
  );
}