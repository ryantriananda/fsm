import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryfflegbywjmmykdojay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZmZsZWdieXdqbW15a2RvamF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNTk2NDUsImV4cCI6MjA4MDgzNTY0NX0._3TfYjWENqk6wmZcW7daENBYcv4DOa1JARokuRTDuRk';

export const supabase = createClient(supabaseUrl, supabaseKey);