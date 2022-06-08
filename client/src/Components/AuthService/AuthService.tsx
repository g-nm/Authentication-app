/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, useEffect, useState } from 'react';
import React from 'react';
import { AuthContextType, IUser } from '../../types';
import { useMutation } from 'react-query';
import { axiosInstance } from '../../scripts/axiosInstance';

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  //   may need to lazy initialize user to set it to user from backend

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get('/auth');
        setUser(true);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setUser(false);
      }
    };
    checkAuth();
  }, []);

  const signupMutation = useMutation(
    (data: IUser) => {
      return axiosInstance.post('/signup', data);
    },
    {
      onSuccess() {
        setUser(true);
      },
    }
  );
  const loginMutation = useMutation(
    (data: IUser) => {
      return axiosInstance.post('/login', data);
    },
    {
      onSuccess() {
        setUser(true);
      },
    }
  );
  const signoutMutation = useMutation(
    () => {
      return axiosInstance.post('/signout');
    },
    {
      onSuccess() {
        setUser(false);
      },
    }
  );
  const signup: AuthContextType['signup'] = (newUser, callback) => {
    return signupMutation.mutate(newUser, {
      onSuccess() {
        setLoading(false);
        callback(null);
      },
      onError(error) {
        callback(error);
      },
    });
  };
  const login: AuthContextType['login'] = (newUser, callback) => {
    return loginMutation.mutate(newUser, {
      onSuccess() {
        setLoading(false);
        callback(null);
      },
      onError(error) {
        callback(error);
      },
    });
  };
  const signout: AuthContextType['signout'] = (callback) => {
    let res: void;
    return signoutMutation.mutate(res, {
      onSuccess() {
        callback();
      },
    });
  };

  const authState = { user, signup, login, signout };

  return (
    <AuthContext.Provider value={authState}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
