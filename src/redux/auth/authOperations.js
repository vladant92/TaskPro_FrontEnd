import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'https://taskpro-backend-t6cg.onrender.com',
});

// Interceptor global pentru gestionarea erorilor de rețea și actualizarea automată a token-ului de autorizare
instance.interceptors.response.use(
  response => response,
  async error => {
    // Verifică dacă eroarea este de tip 401 Unauthorized
    if (error.response.status === 401) {
      try {
        // Extrage token-ul de reîmprospătare din stocarea locală
        const refreshToken = sessionStorage.getItem('refreshToken');
        // Trimite o cerere către server pentru reîmprospătarea token-ului de acces
        const { data } = await instance.post('api/users/refresh', {
          refreshToken,
        });
        // Actualizează token-ul de autorizare și stocarea locală
        setAuthorizationHeaders(data.accessToken);
        // Reia cererea inițială care a fost respinsă cu codul de eroare 401
        return instance(error.config);
      } catch (error) {
        // Tratează erorile în cazul în care cererea de reîmprospătare a token-ului eșuează
        return Promise.reject(error);
      }
    }
    // Pentru alte tipuri de erori, respinge promisiunea cu eroarea respectivă
    return Promise.reject(error);
  }
);

// Funcție pentru setarea header-ului de autorizare
const setAuthorizationHeaders = token => {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

// Funcție pentru ștergerea header-ului de autorizare
const clearAuthorizationHeaders = () => {
  delete instance.defaults.headers.common.Authorization;
};

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const res = await instance.post('api/users/register', credentials);
      if (res.status === 201) {
        const { email, password } = credentials;
        const { data } = await instance.post('api/users/login', {
          email,
          password,
        });
        setAuthorizationHeaders(data.accessToken);
        return data;
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.post('api/users/login', credentials);
      setAuthorizationHeaders(data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
      sessionStorage.setItem('accessToken', data.accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await instance.post('api/users/logout');
    sessionStorage.clear('refreshToken');
    sessionStorage.clear('accessToken');
    clearAuthorizationHeaders();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshCurrentUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        return thunkAPI.rejectWithValue('Unable to fetch user');
      }

      const { data } = await instance.get('api/users/current');
      return data;
    } catch (error) {
      // În caz de eroare, verificăm dacă este un cod de eroare 401 Unauthorized
      if (error.response && error.response.status === 401) {
        // Dacă este 401, apelăm funcția de reîmprospătare a token-ului
        try {
          const refreshToken = sessionStorage.getItem('refreshToken');
          const { data } = await instance.post('api/users/refresh', {
            refreshToken,
          });
          setAuthorizationHeaders(data.accessToken);
          sessionStorage.setItem('refreshToken', data.refreshToken);
          sessionStorage.setItem('accessToken', data.accessToken);
          // După actualizarea token-ului, reluăm cererea originală
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return instance(originalRequest);
        } catch (error) {
          return thunkAPI.rejectWithValue(error.message);
        }
      } else {
        // Dacă nu este 401, respingem promisiunea cu eroarea respectivă
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const changeTheme = createAsyncThunk(
  'auth/theme',
  async ({ theme }, thunkAPI) => {
    try {
      const { data } = await instance.patch('api/users/theme', { theme });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/profile',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.put('api/users/profile', credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const needHelp = createAsyncThunk(
  'auth/needHelp',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.post('api/users/help', credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export default instance;
