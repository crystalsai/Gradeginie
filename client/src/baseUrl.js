export const baseApiURL = () => {
  return process.env.REACT_APP_APILINK || "/api";
};

export const baseMediaURL = () => {
  return process.env.REACT_APP_MEDIA_LINK || "/media";
};

export const mediaURL = (path) => {
  if (!path) {
    return "";
  }

  if (/^(data:|https?:|blob:)/i.test(path)) {
    return path;
  }

  return `${baseMediaURL()}/${path}`;
};
