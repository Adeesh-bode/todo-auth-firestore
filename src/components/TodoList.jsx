import TodoItem from "./TodoItem";

const TodoList = ({todos, setEdit, removeTodo}) => {
    return (
        <div className="rounded-lg bg-[#18181C] p-4 w-full max-w-2xl lg:w-xl shadow-md">
            <ul className="text-[#f5f8ff] font-medium text-lg flex flex-col gap-4">
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} setEdit={setEdit} removeTodo={removeTodo}/>
                ))}
            </ul>
        </div>
    )
}

export default TodoList;