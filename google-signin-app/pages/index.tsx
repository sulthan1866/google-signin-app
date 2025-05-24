import { useAuth } from "@/context/AuthContext";
import { Alert, Avatar, Box, Button, Container, Stack, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

const YOUR_FCM_SERVER_KEY = process.env.NEXT_PUBLIC_FCM_KEY;

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [notificationStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/save-token')
      .then(res => res.json())
      .then(data => setDeviceToken(data.token));
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
    if (!deviceToken) {
      alert('No device token found for current device');
      return;
    }

    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${YOUR_FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: deviceToken,
        notification: {
          title: 'Hello from google-signin-app',
          body: 'This is a notification !',
        },
        priority: 'high',
      }),
    });

    // const data = await res.json();
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