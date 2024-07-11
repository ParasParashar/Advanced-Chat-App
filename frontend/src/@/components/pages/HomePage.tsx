import { FaComments } from "react-icons/fa";
import Header from "../shared/Header";

const HomePage = () => {
  return (
    <main className="flex flex-col items-center  min-h-screen w-full bg-gradient-to-tr from-sky-100 to-slate-100 via-indigo-300">
      <Header type="home" />
      <div className="flex flex-col items-center justify-center p-8 mx-auto my-auto text-center    bg-indigo-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 rounded-lg shadow-md">
        <FaComments className="text-blue-500 text-6xl mb-4" />
        <h3 className="text-3xl font-serif text-white">
          Currently you don't have any conversation selected
        </h3>
      </div>
    </main>
  );
};

export default HomePage;
