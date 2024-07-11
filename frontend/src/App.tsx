import { Route, Routes } from "react-router-dom";
import Layout from "./@/components/shared/Layout";
import MessagePage from "./@/components/pages/MessagePage";
import HomePage from "./@/components/pages/HomePage";
import LoginPage from "./@/components/pages/LoginPage";
import SignUpPage from "./@/components/pages/SignupPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/messages/:id" element={<MessagePage />} />
      </Route>
    </Routes>
  );
}
