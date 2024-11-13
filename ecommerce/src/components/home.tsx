import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './header';
import { getTokens, hasToken } from '../fetch/accessToken';
import Cookies from 'js-cookie';

export default function Home() {
  // const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(hasToken());
    if (hasToken() === false) {
      navigate('/');
    }
    else {
      Cookies.set("accessToken", getTokens(), { expires: 1 });
    }
  }, [navigate]);

  if (isAuthenticated === false){
    return null
  }

  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
}
