
const GITHUB_CLIENT_ID  = import.meta.env.VITE_GITHUB_CLIENT_ID

const REDIRECT_URI = "http://localhost:5173/oauth/callback";

export const connectGitHub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
};


