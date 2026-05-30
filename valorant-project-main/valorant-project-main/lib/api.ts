import axios, { AxiosInstance, AxiosError } from 'axios';
import { getIdToken } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Firebase token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await getIdToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// API Functions

// Auth
export const loginOrRegister = async () => {
    const response = await apiClient.post('/api/auth/login');
    return response.data;
};

export const forgotPassword = async (email: string) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return response.data;
};

// Users
export const getUserProfile = async (userId: number) => {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId: number, data: any) => {
    const response = await apiClient.put(`/api/users/${userId}`, data);
    return response.data;
};

// Availability
export const markUserReady = async (userId: number, gameMode: string, rankRange: string) => {
    const response = await apiClient.post('/api/availability/ready', {
        userId,
        gameMode,
        rankRange,
    });
    return response.data;
};

export const removeUserFromQueue = async (userId: number) => {
    const response = await apiClient.delete(`/api/availability/ready/${userId}`);
    return response.data;
};

export const getReadyUsers = async () => {
    const response = await apiClient.get('/api/availability/ready');
    return response.data;
};

export const checkUserReady = async (userId: number) => {
    const response = await apiClient.get(`/api/availability/ready/${userId}`);
    return response.data;
};

// Matches
export const getMatch = async (matchId: number) => {
    const response = await apiClient.get(`/api/match/${matchId}`);
    return response.data;
};

export const getMatchHistory = async (userId: number) => {
    const response = await apiClient.get(`/api/match/history/${userId}`);
    return response.data;
};

export const createMatch = async (data: any) => {
    const response = await apiClient.post('/api/match', data);
    return response.data;
};

export default apiClient;
