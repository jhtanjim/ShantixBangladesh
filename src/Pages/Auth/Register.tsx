import { useState } from "react";
import { useRegister } from "../../hooks/useAuth";

const Register = () => {
  const { mutate, isPending, isSuccess } = useRegister();
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-2xl shadow-lg space-y-4 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-dark-blue">Register</h2>
        {["firstName", "lastName", "email", "phone", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-blue text-white px-4 py-2 rounded hover:bg-dark-blue"
        >
          {isPending ? "Registering..." : "Register"}
        </button>
        {isSuccess && <p className="text-green-600">Registered successfully!</p>}
      </form>
    </div>
  );
};

export default Register;
