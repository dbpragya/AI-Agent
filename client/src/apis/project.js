import apiClient from './apiClient';

/**
 * Upload a new project with a document and description.
 * @param {Object} projectData - The project data.
 * @param {string} projectData.projectName - Name of the project.
 * @param {string} projectData.description - User story or description.
 * @param {File} projectData.file - The document file to upload.
 * @returns {Promise<Object>} The server response.
 */
export const uploadProject = async ({ projectName, description, file }) => {
  const formData = new FormData();
  formData.append('projectName', projectName);
  formData.append('description', description);
  formData.append('file', file);

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Fetch all project summaries.
 * @returns {Promise<Object>} The server response containing projects data.
 */
export const getSummary = async () => {
  const response = await apiClient.get('/projects');
  return response.data;
};

/**
 * Trigger AI summary generation for a project.
 * @param {string} projectId - The project ID.
 * @returns {Promise<Object>} The server response containing the generated summary.
 */
export const generateSummary = async (projectId) => {
  const response = await apiClient.get(`/summary/${projectId}`);
  return response.data;
};
