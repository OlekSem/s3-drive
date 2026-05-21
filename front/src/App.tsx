
import './App.css'
// import {useTheme} from "./hooks/useTheme.ts";
import {RouteLayout} from "./layout/RouteLayout.tsx";

function App() {
    // const { theme, toggleTheme } = useTheme();

  return (
    <>
        <div className="bg-[var(--bg)] w-full h-screen">
            <RouteLayout />
        </div>
    </>
  )
}

export default App
