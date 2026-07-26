import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hpmmkfsirygnmjxexfrh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbW1rZnNpcnlnbm1qeGV4ZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNDUyNDUsImV4cCI6MjEwMDYyMTI0NX0.pBcgRplhCqjUc1l68uk6eQhgTo7cr_bOwCvobpwYZxQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const STORAGE_BUCKET = 'owner-photos'

export default supabase
