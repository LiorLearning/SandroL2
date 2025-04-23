import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klgpaihopehvotwmrvwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZ3BhaWhvcGVodm90d21ydnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTM2NTIsImV4cCI6MjA1OTI4OTY1Mn0.F7A83zJ_iiKu0NmgsFY3LolhPtTqevO444tLdYgm5Qc';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or anonymous key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * @typedef {Object} FormSubmission
 * @property {string} [id]
 * @property {string} [created_at]
 * @property {Object} form_data
 */

/**
 * Saves form submission data to Supabase
 * @param {Object} formData - The form data to save
 * @returns {Promise<{data: FormSubmission|null, error: Error|null}>}
 */
export async function saveFormSubmission(formData) {
  try {
    console.log('Saving form submission:', formData);
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{ form_data: formData, game: 'Sandro_game' }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving form submission:', error);
    return { data: null, error: error };
  }
}

/**
 * Saves user data to Supabase
 * @param {string} user - The username to save
 * @returns {Promise<{data: FormSubmission|null, error: Error|null}>}
 */
export async function saveUser(user) {
  try {
    const { data, error } = await supabase
      .from('tof_users')
      .insert([{ name: user, game: 'Sandro_game' }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving form submission:', error);
    return { data: null, error: error };
  }
}

/**
 * Gets recent form submissions from Supabase
 * @returns {Promise<{data: Array<FormSubmission>|null, error: Error|null}>}
 */
export async function getFormSubmissions() {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error retrieving form submissions:', error);
    return { data: null, error: error };
  }
} 