import axios from "axios";

export const api = axios.create({
    baseURL: "https://sistema-de-agendamentos.onrender.com",
});