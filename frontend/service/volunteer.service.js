import api from "./api";

// Create Volunteer
export const createVolunteer = async (data) => {
    try {
        const response = await api.post("/volunteers", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Volunteers
export const getVolunteers = async (params) => {
    try {
        const response = await api.get("/volunteers", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Volunteer by ID
export const getVolunteerById = async (id) => {
    try {
        const response = await api.get(`/volunteers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Volunteer
export const updateVolunteer = async (id, data) => {
    try {
        const response = await api.put(`/volunteers/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Volunteer
export const deleteVolunteer = async (id) => {
    try {
        const response = await api.delete(`/volunteers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const applyVolunteer = async (data) => {
    try {
        const response = await api.post("/volunteers/apply", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
