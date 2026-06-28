import api from "./api";

class SongService {
  async addSong(spaceId: string, guestUuid: string, youtubeURL: string, idempotencyKey?: string) {
    const key = idempotencyKey || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15));
    const response = await api.post(
      '/add',
      { spaceId, youtubeURL },
      {
        headers: {
          'x-guest-uuid': guestUuid,
          'X-Idempotency-Key': key,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  async upvoteSong(spaceId: string, songId: string, guestUuid: string) {
    const response = await api.post(
      '/upvote',
      { spaceId, songId },
      {
        headers: {
          'x-guest-uuid': guestUuid,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  async getSpaceSongs(spaceId: string) {
    const response = await api.get(`/${spaceId}/songs`);
    return response.data;
  }
}

export const songService = new SongService();
export default songService;
