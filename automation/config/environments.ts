const base_url = 'https://globalsubmit.test.certara.net/Security/';

const credentials = {
    admin: {
        username: 'automation3@globalsubmit.com',
        password: 'GSQ3t3$t!!!!!!',
        workspace: 'Test Company 1',
    },
    incorrect_user: {
        username: 'incorrect@globalsubmit.com',
        password: 'incorrect',
    },
    noPermissionsUser: {
        username: 'automation31@globalsubmit.com',
        password: 'GSQ3t3$t!!!!!!',
    },
    supportUser: {
        username: 'automation3@globalsubmit.com',
        password: 'GSQ3t3$t!!!!!!',
        workspace: 'Test Company 1',
    },
};

const current_version = '26.1.1.2088';

export { credentials, base_url, current_version };
