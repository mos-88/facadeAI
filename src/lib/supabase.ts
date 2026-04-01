import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://wwexxmiyxtbkdluddhzk.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjY0ZDE0OTZmLWRjOWMtNDg0Zi05MGQ3LTU5Y2U2NThlMzc2YSJ9.eyJwcm9qZWN0SWQiOiJ3d2V4eG1peXh0YmtkbHVkZGh6ayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc1MDc3NzI1LCJleHAiOjIwOTA0Mzc3MjUsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.hFLYoz8bNDxZjutDskP_CMs2nxwTCOxsDfRn1LJASyk';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };