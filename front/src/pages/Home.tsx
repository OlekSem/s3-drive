import { useAppSelector } from "../hooks/redux.ts";

const Home = () => {
    // Check if user is logged in to toggle contextual elements later
    const user = useAppSelector((state) => state.authReducer.user);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center max-w-4xl mx-auto">

            {/* 1. Visual Anchor Icon / Minimal Graphics */}
            <div className="relative mb-6">
                <span className="text-7xl block select-none animate-pulse">☁️</span>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                    ✓
                </div>
            </div>

            {/* 2. Main Title Header */}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-color)] mb-4">
                Персональне Хмарне <br />
                <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent">
                    S3 Сховище Даних
                </span>
            </h1>

            {/* 3. Subtitle Description */}
            <p className="text-base md:text-lg text-gray-400 max-w-xl mb-8 leading-relaxed">
                Надійний, швидкий та мінімалістичний простір для збереження ваших файлів.
                Керуйте папками, завантажуйте медіа.
            </p>

            {/* 4. Action Context Banner */}
            {!user ? (
                <div className="w-full max-w-md p-5 bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-sm animate-in fade-in zoom-in-95">
                    <p className="text-sm font-medium text-[var(--text-color)] mb-2">
                        🔒 Доступ обмежено
                    </p>
                    <p className="text-xs text-gray-400">
                        Щоб розпочати роботу з файловим менеджером, будь ласка, скористайтеся кнопкою
                        <span className="text-blue-400 font-semibold mx-1">Log in</span>
                        у верхньому правому кутку профілю.
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium rounded-xl">
                    👋 З поверненням, {user.username}! Ви можете перейти до завантаження файлів.
                </div>
            )}

        </div>
    );
};

export default Home;