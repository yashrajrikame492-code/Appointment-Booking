import { loginAPI } from "../api";

function Login() {

  const handleLogin = () => {
    loginAPI({
      username: "admin",
      password: "1122raj"
    }).then(data => {
      console.log(data);

      if (data.access) {
        localStorage.setItem("token", data.access);
        alert("Login Success ✅");
      } else {
        alert("Login Failed ❌");
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;