import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gradient-to-br from-gray-800 to-blue-800 via-gray-500 ">
      <div
        //    className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md"
        className="max-w-md w-full space-y-6 p-8 shadow-md rounded-lg bg-indigo-100  bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30  "
      >
        <h1 className="text-4xl font-bold text-center text-white">
          Sign Up for <span className="text-gray-700">CHAT-APP</span>
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="John Doe"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Gender
            </label>
            <div className="flex items-center mt-1">
              <label className="flex items-center text-gray-300">
                <Input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-2 text-blue-600 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                Male
              </label>
              <label className="flex items-center ml-4 text-gray-300">
                <Input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="w-4 h-4 mr-2 text-blue-600 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                />
                Female
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="text-sm text-gray-700 hover:text-blue-500"
            >
              Already have an account? <span className=" font-bold">Login</span>
            </Link>
            <Button
              size="lg"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
