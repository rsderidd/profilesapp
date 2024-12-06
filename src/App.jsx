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
        {/* Heading */}
        <Heading level={1}>GIC Tracker</Heading>

      {/* Tab Buttons */}
      <Flex
        className="tab-container"
        justifyContent="space-evenly"  // Distribute buttons evenly
        alignItems="center"
        width="100%"  // Ensure it spans the full width
      >
      <button id="Accounts"
        className={`tablink ${activeTab === 'Accounts' ? 'active' : ''}`}
        onClick={() => openPage('Accounts')}
      >
        Accounts
      </button>
      <button id="Holdings"
        className={`tablink ${activeTab === 'Holdings' ? 'active' : ''}`}
        onClick={() => openPage('Holdings')}
      >
        Holdings
      </button>
      <button id="Ledger"
        className={`tablink ${activeTab === 'Ledger' ? 'active' : ''}`}
        onClick={() => openPage('Ledger')}
      >
        Ledger
      </button>

      <button id="About"
        className={`tablink ${activeTab === 'About' ? 'active' : ''}`}
        onClick={() => openPage('About')}
      >
        About
      </button>
      </Flex>

    
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
      <div id="Accounts" className={`tabcontent ${activeTab === 'Accounts' ? 'active' : ''}`}>
        <h3>Accounts</h3>
        <p>Home is where the heart is..</p>
      </div>
    
      <div  id="Holdings" className={`tabcontent ${activeTab === 'Holdings' ? 'active' : ''}`}>
        <h3>Holdings</h3>
        <p>Some news this fine day!</p>
      </div>
    
      <div id="Ledger" className={`tabcontent ${activeTab === 'Ledger' ? 'active' : ''}`}>
        <h3>Ledger</h3>
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
