
import { Track } from "../types";

const PROXY = "https://corsproxy.io/?";
const BASE_URL = "https://api.deezer.com";

const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
};

export const fetchDeezerSearch = async (query: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/search?q=${query}`)}`);
    const data = await response.json();
    return data.data.map((t: any) => ({
      id: `deezer-${t.id}`,
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      duration: formatDuration(t.duration),
      coverUrl: t.album.cover_xl || t.album.cover_medium,
      previewUrl: t.preview,
      isLiked: false
    }));
  } catch (error) {
    console.error("Error searching Deezer:", error);
    return [];
  }
};

export const fetchDeezerPlaylist = async (playlistId: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/playlist/${playlistId}`)}`);
    const data = await response.json();
    return data.tracks.data.map((t: any) => ({
      id: `deezer-${t.id}`,
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      duration: formatDuration(t.duration),
      coverUrl: t.album.cover_xl || t.album.cover_medium,
      previewUrl: t.preview,
      isLiked: false
    }));
  } catch (error) {
    console.error("Error fetching Deezer playlist:", error);
    return [];
  }
};

export const fetchDeezerArtistTopTracks = async (artistId: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/artist/${artistId}/top?limit=10`)}`);
    const data = await response.json();
    return data.data.map((t: any) => ({
      id: `deezer-${t.id}`,
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      duration: formatDuration(t.duration),
      coverUrl: t.album.cover_xl || t.album.cover_medium,
      previewUrl: t.preview,
      isLiked: false
    }));
  } catch (error) {
    console.error("Error fetching Deezer artist tracks:", error);
    return [];
  }
};

export const fetchDeezerAlbum = async (albumId: string): Promise<Track[]> => {
  try {
    const response = await fetch(`${PROXY}${encodeURIComponent(`${BASE_URL}/album/${albumId}`)}`);
    const data = await response.json();
    return data.tracks.data.map((t: any) => ({
      id: `deezer-${t.id}`,
      title: t.title,
      artist: data.artist.name,
      album: data.title,
      duration: formatDuration(t.duration),
      coverUrl: data.cover_xl || data.cover_medium,
      previewUrl: t.preview,
      isLiked: false
    }));
  } catch (error) {
    console.error("Error fetching Deezer album:", error);
    return [];
  }
};
