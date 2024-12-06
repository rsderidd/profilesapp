import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import './App.css';

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

 
  // Function to change the active tab
  const openPage = (pageName) => {
    setActiveTab(pageName);
    console.log('Switching to tab:', pageName); // Debugging line
  
  };

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      {/* Tab Buttons */}
      <button id="Home"
        className={`tablink ${activeTab === 'Home' ? 'active' : ''}`}
        onClick={() => openPage('Home')}
      >
        Home
      </button>
      <button id="News"
        className={`tablink ${activeTab === 'News' ? 'active' : ''}`}
        onClick={() => openPage('News')}
      >
        News
      </button>
      <button id="Contact"
        className={`tablink ${activeTab === 'Contact' ? 'active' : ''}`}
        onClick={() => openPage('Contact')}
      >
        Contact
      </button>
      <button id="About"
        className={`tablink ${activeTab === 'About' ? 'active' : ''}`}
        onClick={() => openPage('About')}
      >
        About
      </button>

      {/* Heading */}
      <Heading level={1}>My Profile</Heading>

      <Divider />

      {/* Grid of user profiles */}
      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email} {userprofile.profileOwner}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>

      {/* Tab Content */}
      <div id="Home" className={`tabcontent ${activeTab === 'Home' ? 'active' : ''}`}>
        <h3>Home</h3>
        <p>Home is where the heart is..</p>
      </div>
    
      <div  id="News" className={`tabcontent ${activeTab === 'News' ? 'active' : ''}`}>
        <h3>News</h3>
        <p>Some news this fine day!</p>
      </div>
    
      <div id="Contact" className={`tabcontent ${activeTab === 'Contact' ? 'active' : ''}`}>
        <h3>Contact</h3>
        <p>Get in touch, or swing by for a cup of coffee.</p>
      </div>
    
      <div id="About" className={`tabcontent ${activeTab === 'About' ? 'active' : ''}`}>
        <h3>About</h3>
        <p>Who we are and what we do.</p>
      </div>

      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
