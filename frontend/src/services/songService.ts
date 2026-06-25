import api from "./api";

class SongService {
  async addSong(spaceId: string, guestUuid: string, youtubeURL: string) {
    const response = await api.post(
      '/add',
      { spaceId, youtubeURL },
      {
        headers: {
          'x-guest-uuid': guestUuid,
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
