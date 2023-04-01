import callApi from "./Request";

const songService = {
  get: async (params) => {
    return await callApi("songs", "get", null, params);
  },
  insertSong: async (song, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("song", JSON.stringify(song));
    console.log(formData);
    const headers = { "Content-Type": "multipart/form-data" };
    return await callApi("songs", "post", formData, {}, headers);
  },
  updateSongWithFile: async (id, song, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("song", JSON.stringify(song));
    const headers = { "Content-Type": "multipart/form-data" };
    return await callApi(`songs/withf/${id}`, "put", formData, {}, headers);
  },
  updateSongWithoutFile: async (id, song) => {
    const formData = new FormData();
    formData.append("song", JSON.stringify(song));
    const headers = { "Content-Type": "multipart/form-data" };
    return await callApi(`songs/withoutf/${id}`, "put", formData, {}, headers);
  },
  deleteSong: async (id) => {
    return await callApi(`songs/${id}`, "delete");
  },
  deleteAllSong: async () => {
    return await callApi("songs", "delete");
  },
};

export default songService;
