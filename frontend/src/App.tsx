import "./App.css";
import { supabase } from "./supabaseClient";

function App() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in:", error.message);
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Travel App</h1>
        <button onClick={handleLogin}>Sign in with Google</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
