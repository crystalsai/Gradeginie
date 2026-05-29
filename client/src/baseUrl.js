export const baseApiURL = () => {
  return process.env.REACT_APP_APILINK || "/api";
};

export const baseMediaURL = () => {
  return process.env.REACT_APP_MEDIA_LINK || "/media";
};
