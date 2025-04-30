import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js";
import { TripList } from "./components/TripList";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in:", error.message);
  };
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return user ? (
    <>
      <p>Welcome, {user.email}</p>
      <TripList user={user} />
    </>
  ) : (
    <button onClick={handleLogin}>Login with Google</button>
  );
}

export default App;
