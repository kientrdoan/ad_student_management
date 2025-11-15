import { BaseService } from "./BaseService";

export class RoomService extends BaseService {
  constructor() {
    super();
  }

  getAllRoom = (payload) => {
    return this.get_token(`/admins/rooms/`, payload);
  };

  getRoom = (id) => {
    return this.get_token(`/admins/rooms/${id}`);
  };

  addRoom = (payload) => {
    return this.post_token(`/admins/rooms/`, payload)
  }

  editRoom = (id, payload) => {
    return this.put(`/admins/rooms/${id}`, payload)
  }

  deleteRoom = (id) => {
    return this.delete(`/admins/rooms/${id}`)
  }
}

export const roomService = new RoomService();