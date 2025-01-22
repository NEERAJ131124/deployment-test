const { ClientSecretCredential } = require('@azure/identity');

// Azure AD credentials
const tenantId = 'd75b5bb2-a9fd-4ac8-aa41-489d8262832f';
const clientId = '34731993-d94c-429c-8bab-0d33fb97f556';
const clientSecret = 'fa188d2b-1328-4aad-844b-1797da88d813';
const mapsResource = 'https://atlas.microsoft.com/';

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

exports.GetAzureMapsToken = async (req, res) => {
    try {
        const tokenResponse = await credential.getToken(mapsResource);
        res.send(tokenResponse.token);
    } catch (err) {
        console.error('Error fetching token:', err);
        res.status(500).send('Error fetching token');
    }
}