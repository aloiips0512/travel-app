import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jtmqgbwhotgkmqzuscch.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bXFnYndob3Rna21xenVzY2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzIxODUsImV4cCI6MjA1ODk0ODE4NX0.nIREcIgNrsXgt47JQacoNAvvY6maUcDNmu9RqF-na9M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
