import { useAuth } from "@/context/AuthContext";
import { Alert, Avatar, Box, Button, Container, Stack, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [notificationStatus] = useState<string | null>(null);
  const [token,setToken] = useState<string>('')

  useEffect(() => {
    const getToken = async () => {
      const res = await fetch('/api/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'DUMMY_TOKEN_FOR_DEMO' }), // Replace with real token
      });

      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        console.log('📱 Device token set in state:', data.token);
      } else {
        console.warn('No token returned from server.');
      }
    };

    getToken();
  }, []);
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


const sendNotification = async () => {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      title: 'Hello!',
      body: 'This is a test notification.',
    }),
  });

  const data = await response.json();
  console.log('Notification Response:', data);
};


  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <Avatar
          src={currentUser?.photoURL || 'https://avatars.githubusercontent.com/u/50585782'}
          alt={`${currentUser?.displayName || 'User'}'s profile`}
          sx={{ width: 100, height: 100, margin: "auto" }}
        />
        <Typography variant="h4" mt={2}>
          Hello, {currentUser.displayName} 👋
        </Typography>
        
        {notificationStatus && (
          <Alert 
            severity={notificationStatus.includes('successfully') ? 'success' : 'error'}
            sx={{ mt: 3, mb: 2 }}
          >
            {notificationStatus}
          </Alert>
        )}
        
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={sendNotification}
            sx={{ py: 1.5 }}
          >
            Send Push Notification
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
