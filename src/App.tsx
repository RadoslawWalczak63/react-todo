import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Task {
    id: number;
    text: string;
    category: string;
    type: "codzienne" | "jednorazowe";
}

const TodoApp: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(
        JSON.parse(localStorage.getItem("tasks") || "[]")
    );
    const [task, setTask] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [type, setType] = useState<"codzienne" | "jednorazowe">("codzienne");
    const [categories, setCategories] = useState<string[]>(
        JSON.parse(
            localStorage.getItem("categories") ||
            '[]'
        )
    );
    const [newCategory, setNewCategory] = useState<string>("");

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

    const addTask = (): void => {
        if (!task.trim()) {
            Swal.fire({
                icon: "error",
                title: "Błąd",
                toast: true,
                position: "top-right",
                timer: 3000,
                text: "Nie można dodać pustego zadania",
            });
            return;
        }

        if (!category.trim()) {
            Swal.fire({
                icon: "error",
                title: "Błąd",
                toast: true,
                position: "top-right",
                timer: 3000,
                text: "Nie można dodać zadania bez kategorii",
            });
            return;
        }

        setTasks([...tasks, { id: Date.now(), text: task, category, type }]);
        setTask("");
        Swal.fire({
            icon: "success",
            title: "Sukces",
            toast: true,
            position: "top-right",
            timer: 3000,
            text: "Zadanie zostało dodane",
        });
    };

    const removeTask = (id: number): void => {
        setTasks(tasks.filter((t) => t.id !== id));
        Swal.fire({
            icon: "success",
            title: "Sukces",
            toast: true,
            position: "top-right",
            timer: 3000,
            text: "Zadanie zostało usunięte",
        });
    };

    const addCategory = (): void => {
        if (!newCategory.trim() || categories.includes(newCategory)) return;
        setCategories([...categories, newCategory]);
        setNewCategory("");
        Swal.fire({
            icon: "success",
            title: "Sukces",
            toast: true,
            position: "top-right",
            timer: 3000,
            text: "Kategoria została dodana",
        });
    };

    const removeCategory = (cat: string): void => {
        Swal.fire({
            icon: "warning",
            title: "Uwaga",
            text: "Usunięcie kategorii spowoduje usunięcie przypisanych do niej zadań!",
            showCancelButton: true,
            showConfirmButton: true,
        }).then((response) => {
            if (!response.isConfirmed) return;

            setCategories(categories.filter((c) => c !== cat));
            setTasks(tasks.filter((t) => t.category !== cat));
        })
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: number) => {
        event.dataTransfer.setData("taskId", taskId.toString());
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, newCategory: string) => {
        event.preventDefault();
        const taskId = parseInt(event.dataTransfer.getData("taskId"), 10);
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, category: newCategory } : task
        );
        setTasks(updatedTasks);
        Swal.fire({
            icon: "success",
            title: "Sukces",
            toast: true,
            position: "top-right",
            timer: 3000,
            text: "Zadanie zostało przeniesione",
        });
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className="p-6 container mx-auto flex flex-col gap-6 bg-gray-900 text-gray-200 min-h-screen">
            <div className="p-4 bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Kategorie</h2>
                <ul className="mb-4 space-y-2">
                    {categories.map((cat) => (
                        <li key={cat} className="py-1 flex justify-between">
                            {cat}
                            <button
                                onClick={() => removeCategory(cat)}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                            >
                                Usuń
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nowa kategoria"
                        className="bg-gray-700 text-gray-200 placeholder-gray-500 border border-gray-600 focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 px-4 py-3 rounded-lg outline-none transition duration-300 ease-in-out w-full"
                    />
                    <button
                        onClick={addCategory}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300 ease-in-out"
                    >
                        Dodaj
                    </button>
                </div>
            </div>
            <div className="p-4 bg-gray-800 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6">Dodaj nowe zadanie</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex flex-col">
                        <label className="text-gray-400 text-sm mb-1">Zadanie</label>
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Wpisz treść zadania"
                            className="bg-gray-700 text-gray-200 placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-4 py-3 rounded-lg outline-none transition duration-300 ease-in-out w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-400 text-sm mb-1">Kategoria</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-gray-700 text-gray-200 placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-4 py-3 rounded-lg outline-none transition duration-300 ease-in-out w-full appearance-none"
                        >
                            <option value="">Wybierz kategorię</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-400 text-sm mb-1">Typ</label>
                        <select
                            value={type}
                            onChange={(e) =>
                                setType(
                                    e.target.value as "codzienne" | "jednorazowe"
                                )
                            }
                            className="bg-gray-700 text-gray-200 placeholder-gray-500 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-4 py-3 rounded-lg outline-none transition duration-300 ease-in-out w-full appearance-none"
                        >
                            <option value="codzienne">Codzienne</option>
                            <option value="jednorazowe">Jednorazowe</option>
                        </select>
                    </div>
                    <button
                        onClick={addTask}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300 ease-in-out w-full"
                    >
                        Dodaj
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat}
                        onDrop={(event) => handleDrop(event, cat)}
                        onDragOver={handleDragOver}
                        className="p-4 bg-gray-800 shadow-md rounded-lg"
                    >
                        <h2 className="text-lg font-semibold mb-2">{cat}</h2>
                        <div className="space-y-2">
                            {tasks
                                .filter((task) => task.category === cat)
                                .map((task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(event) =>
                                            handleDragStart(event, task.id)
                                        }
                                        className="p-4 bg-gray-700 shadow-md rounded-lg flex justify-between items-center cursor-grab"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {task.text}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {task.category} - {task.type}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeTask(task.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoApp;