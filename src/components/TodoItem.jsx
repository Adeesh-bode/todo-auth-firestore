import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const TodoItem = ({todo, setEdit, removeTodo}) => {
    return (
        <li className="bg-[#302D36] p-4 rounded-lg shadow-md flex items-center justify-between">
            <span>{todo.todo}</span>
            <div className="flex gap-2">
                <button onClick={() => setEdit(todo.id)} className="font-medium text-[#F5F8FF] bg-teal-400 hover:bg-[#84849D] px-4 py-2 rounded-lg">
                    <FaPencilAlt />
                </button>
                <button onClick={() => removeTodo(todo.id)} className="font-medium text-[#F5F8FF] bg-teal-400 hover:bg-[#84849D] px-4 py-2 rounded-lg">
                    <FaTrash />
                </button>
            </div>
        </li>
    )
}

export default TodoItem;

