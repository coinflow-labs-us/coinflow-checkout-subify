import "./App.css";
import { Outlet } from "react-router-dom";
import LogoText from "./assets/logo-text.jpg";
import Logo from "./assets/logo.png";

function App() {
  return (
    <div
      className={
        "w-screen min-h-screen flex flex-col items-center bg-gradient-to-br from-yellow-500 to-orange-500 justify-center text-gray-900 font-semibold text-sm py-20 px-5 space-y-5"
      }
    >
      <div
        className={
          "flex flex-col items-center bg-black w-full md:w-4/5 lg:w-[500px]  shadow-2xl rounded-3xl"
        }
      >
        <div className={"p-10 flex items-center justify-center"}>
          <img className={"w-36"} src={LogoText} alt={"subify"} />
        </div>

        <div className={"relative min-h-[100px] w-full"}>
          <div
            className={
              "absolute top-8 right-8 left-8 bottom-8 animate-pulse bg-zinc-900 rounded-3xl"
            }
          />

          <Outlet />
        </div>

        <div className={"p-10 flex items-center justify-center"}>
          <img className={"w-12"} src={Logo} alt={"subify"} />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ msg }: { msg?: string }) {
  return (
    <div
      className={
        "backdrop-blur-2xl bg-black/60 rounded-3xl backdrop-filter h-60 w-96 flex items-center justify-center"
      }
    >
      <span className={"text-white font-medium text-base"}>
        {msg ? msg : "No user found..."}
      </span>
    </div>
  );
}

export default App;
