import React, { useState } from "react";
import { LogUser } from "../ApiCall";
import { useDispatch } from "react-redux";
import { storeUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import { RegisterSchema } from "../../../Backend/Zod/Auth";
import { toast } from "sonner";
import { Spin } from "antd";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = (data) => {
    const { error } = RegisterSchema.safeParse(data);
    if (!error) {
      setEmailError("");
      setPassError("");
      return;
    }
    error.issues.forEach((e) => {
      if (e.path[0] === "email") setEmailError(e.message);
      if (e.path[0] === "password") setPassError(e.message);
    });
  };

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    validate(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await LogUser(formData);

    if (!res.success) {
      if (res.allErrors) {
        res.allErrors.forEach((v) => {
          if (v.path[0] === "email") setEmailError(v.message);
          if (v.path[0] === "password") setPassError(v.message);
        });
      }
      if (res.msg) {
        setEmailError("");
        setPassError("");
        setError(res.msg);
      }
      toast("Login Failed");
      setLoading(false);
      return;
    }

    dispatch(storeUser(res.cur));
    toast("Logged In Successfully");
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 animate-in fade-in duration-700">
        <h2 className="text-4xl font-bold text-center text-green-600 mb-10">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none"
              onChange={handleChange}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {emailError}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none"
              onChange={handleChange}
              required
            />
            {passError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {passError}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-70"
          >
            {loading ? <Spin /> : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500">
          Secure authentication powered by modern standards
        </p>
      </div>
    </div>
  );
};

export default Login;
