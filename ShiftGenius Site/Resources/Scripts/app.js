// Function to handle login
const login = (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    auth0.login(
        {
            realm: 'Username-Password-Authentication', // Replace with your connection name
            username,
            password,
        },
        (err) => {
            if (err) {
                console.error('Login failed:', err);
                // Handle the error here - show an error message to the user or perform any necessary actions.
                if (err.description === 'Wrong email or password.') {
                    document.getElementById('error-message').innerText = 'Invalid email or password. Please try again.';
                } else {
                    document.getElementById('error-message').innerText = 'An error occurred during login. Please try again later.';
                }
            }
        }
    );
};

// Function to handle authentication callback
const handleAuthentication = () => {
    auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            console.log('User authenticated:', authResult);

            // User is authenticated, hide the login form and login button, and show the other button
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('other-button').style.display = 'block';
        } else if (err) {
            console.error('Authentication error:', err);
        } else {
            console.log('User not authenticated.');

            // User is not authenticated, show the login form and login button, hide the other button
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('other-button').style.display = 'none';
        }
    });
};

// Attach event listener to the login form submit
document.getElementById('login-form').addEventListener('submit', login);

// Load Auth0.js library asynchronously
function initializeAuth0() {
    const domain = 'shiftmedpoc.us.auth0.com'; // Replace with your Auth0 domain
    const clientID = 'QpSQiuXKNMMKLGgD0ir0TSTe5qIzls2R'; // Replace with your Auth0 client ID

    // Initialize the Auth0 object
    auth0 = new auth0.WebAuth({
        domain: domain,
        clientID: clientID,
        redirectUri: window.location.href,
        responseType: 'token id_token',
        scope: 'openid profile',
    });

    // Call handleAuthentication when the page loads
    handleAuthentication();
}

const redirectToSalesforceAuthProvider = () => {
    const clientId = '3MVG9ux34Ig8G5ep1V9v4nmCjLieUqS9s8bNpefgN1pe7s3olzeO2Y.IZ.ZsBuRFiOcShkU7e5owXKK18HMoJ';
    const redirectUri = 'https://axyz4-dev-ed.develop.my.salesforce.com/apex/RedirectLogin'; // Replace with your Auth0 callback URL
  
    // URL to redirect to Salesforce auth provider initialization URL
    const salesforceAuthUrl = `https://axyz4-dev-ed.develop.my.salesforce.com/services/auth/sso/ShiftMedAuth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    window.location.href = salesforceAuthUrl;
};


// Attach event listener to the "other-button"
document.getElementById('other-button').addEventListener('click', () => {
    redirectToSalesforceAuthProvider();
    // Note: Do not call handleSalesforceAuthProviderCallback here
});

// Initialize Auth0 and handle its authentication callback
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth0();
    handleAuthentication();

    // Call handleSalesforceAuthProviderCallback after the Auth0 callback
    handleSalesforceAuthProviderCallback();
});


// Function to handle authentication callback from Salesforce auth provider
const handleSalesforceAuthProviderCallback = async () => {

    // Parse the URL to get the authorization code from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    if (authCode) {
       
      // Define your Salesforce token endpoint URL
      const tokenEndpoint = 'https://axyz4-dev-ed.develop.my.salesforce.com/services/oauth2/token';
  
      // Define your Salesforce Connected App credentials
      const clientId = '3MVG9ux34Ig8G5ep1V9v4nmCjLieUqS9s8bNpefgN1pe7s3olzeO2Y.IZ.ZsBuRFiOcShkU7e5owXKK18HMoJ';
      const clientSecret = '99CA3A3ADA0A333D550F7AA3A279F4929B6F4B528DD149D268D1A02EC922104C';
      const redirectUri = 'https://axyz4-dev-ed--c.develop.vf.force.com/apex/RedirectLogin';
  
      // Construct the request body
      const requestBody = new URLSearchParams();
      requestBody.append('code', authCode);
      requestBody.append('grant_type', 'authorization_code');
      requestBody.append('client_id', clientId);
      requestBody.append('client_secret', clientSecret);
      requestBody.append('redirect_uri', redirectUri);
  
      try {
        // Make a POST request to exchange the authorization code for tokens
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          body: requestBody,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        if (response.ok) {
          const tokenData = await response.json();
  
          // Assuming the access token is in tokenData.access_token
          const accessToken = tokenData.access_token;

          window.location.href = 'https://axyz4-dev-ed.develop.my.salesforce.com/apex/RedirectLogin';
  
          // Now you have the access token, you can use it to verify the user's identity or perform other actions
          // ... perform any necessary actions ...
          console.log('Access token:', accessToken);
        } else {
          console.error('Token exchange failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during token exchange:', error);
      }
    } else {
        console.log('No authorization code found in the URL.');
    }
  };
  
  
  

