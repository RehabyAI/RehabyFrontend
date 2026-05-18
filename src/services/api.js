import axios from 'axios';

const API_BASE_URL = 'https://ai-posture-coach-real-time-exercise-form.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPatient = async (data) => {
  try {
    const response = await apiClient.post('/patients/', {
      full_name: data.full_name,
      age: Number(data.age),
      gender: data.gender,
      condition: data.condition,
      rehab_plan: data.rehab_plan,
    });
    return response.data;
  } catch (error) {
    console.error('Error in createPatient:', error);
    throw error;
  }
};

export const getPatients = async () => {
  try {
    const response = await apiClient.get('/patients/');
    return response.data;
  } catch (error) {
    console.error('Error in getPatients:', error);
    throw error;
  }
};

export const analyzeFrame = async (image_base64) => {
  try {
    const response = await apiClient.post('/analysis/frame', {
      image_base64,
    });
    return response.data;
  } catch (error) {
    console.error('Error in analyzeFrame:', error);
    throw error;
  }
};

export const generateAudio = async (text, lang) => {
  try {
    const response = await apiClient.post(
      '/audio/generate-audio',
      { text, lang },
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    console.error('Error in generateAudio:', error);
    throw error;
  }
};

export const logSession = async (data) => {
  try {
    const response = await apiClient.post('/sessions/', {
      patient_id: data.patient_id,
      exercise_name: data.exercise_name,
      rep_count: Number(data.rep_count),
      average_score: Number(data.average_score),
      errors_detected: data.errors_detected || [],
      feedback_summary: data.feedback_summary || '',
    });
    return response.data;
  } catch (error) {
    console.error('Error in logSession:', error);
    throw error;
  }
};

export const getPatientHistory = async (id) => {
  try {
    const response = await apiClient.get(`/patient/${id}/history`);
    return response.data;
  } catch (error) {
    console.error('Error in getPatientHistory:', error);
    throw error;
  }
};

export const getPatientTrends = async (id) => {
  try {
    const response = await apiClient.get(`/patient/${id}/trends`);
    return response.data;
  } catch (error) {
    console.error('Error in getPatientTrends:', error);
    throw error;
  }
};

export const getPatientErrors = async (id) => {
  try {
    const response = await apiClient.get(`/patient/${id}/errors`);
    return response.data;
  } catch (error) {
    console.error('Error in getPatientErrors:', error);
    throw error;
  }
};
