import axios from 'axios';


const API_BASE = (import.meta.env.VITE_API_BASE) || 'http://localhost:4000';
export const api = axios.create({ baseURL: API_BASE });


export async function createLink(payload) { return api.post('/api/links', payload).then(r=>r.data); }
export async function listLinks() { return api.get('/api/links').then(r=>r.data); }
export async function getLink(code) { return api.get(`/api/links/${code}`).then(r=>r.data); }
export async function deleteLink(code) { return api.delete(`/api/links/${code}`).then(r=>r.data); }