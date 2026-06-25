import api from "./api";

class CreateRoomService {
    async createRoom(spaceName: string, spacePassword: string) {
        try {
            const response = await api.post("/spaces", { spaceName, spacePassword }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating room:", error);
            return null;
        }
    }

    async getAllRooms() {
        try {
            const response = await api.get("/spaces/me", {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching all rooms:", error);
            return null;
        }
    }

    async deleteRoom(roomId: string) {
        try {
            const response = await api.delete(`/spaces/${roomId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting room:", error);
            return null;
        }
    }

    async joinRoom(spaceId: string, guestName: string, spacePassword: string) {
        try {
            const response = await api.post("/spaces/join", {
                spaceId,
                guestName,
                spacePassword,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error joining room:", error);
            return null;
        }
    }

    async getRoomDetails(spaceId: string) {
        try {
            const response = await api.get(`/spaces/${spaceId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error getting room details:", error);
            return null;
        }
    }
}

export const createRoomService = new CreateRoomService();
export default createRoomService;