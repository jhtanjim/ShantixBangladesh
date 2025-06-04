// Register.tsx
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../../api/auth"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" })

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Registration successful!")
      navigate("/login")
    },
    onError: (error) => {
      alert(error?.response?.data?.message || "Registration failed")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md space-y-4">
        <h2 className="text-3xl font-bold text-center text-blue-700">🚘 Register for CarHub</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input" required />
          <input type="text" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input" required />
        </div>
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" required />
        <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
