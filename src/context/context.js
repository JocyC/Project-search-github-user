import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((data) => {
        const remain = data.data.rate.remaining;
        setRequests(remain);
        if (remain === 0) {
          // throw an error
          toggleError(true, "sorry! hourly limit exceeded :0");
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  useEffect(() => {
    checkRequests();
  }, []);

  const searchUser = async (item) => {
    toggleError();
    setLoading(true);
    // toggle error
    const userUrl = `${rootUrl}/users/${item}`;
    const resp = await axios(userUrl).catch((err) => console.log(err));
    if (resp) {
      setGithubUser(resp.data);
      const { login, followers_url } = resp.data;
      //   // repos
      //   await axios(`${rootUrl}/users/${login}/repos?per_page=100`)
      //     .then((resp) => setRepos(resp.data))
      //     .catch((err) => console.log(err));
      //   // followers
      //   await axios(`${followers_url}?per_page=100`)
      //     .then((resp) => setFollowers(resp.data))
      //     .catch((err) => console.log(err));

      // wait till everything is settled, load them at once
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (status === repos.status) {
            setRepos(repos.value.data);
          }
          if (status === followers.status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user with that username");
    }
    setLoading(false);
  };

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        loading,
        repos,
        followers,
        searchUser,
        requests,
        error,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
const useGlobalContext = () => {
  return useContext(GithubContext);
};
export { GithubContext, GithubProvider, useGlobalContext };
