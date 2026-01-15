const base_url = 'https://globalsubmit.test.certara.net/Security/';
const credentials = {
    admin: {
        username: 'automation3@globalsubmit.com',
        password: '',
        workspace: 'Automation3 Space',
        userName: 'Automation 3',
    },
    adminSameOrganization: {
        username: 'automation3@globalsubmit.com',
        password: '',
        workspace: 'Automation3 Space',
    },
    adminOtherOrganization: {
        username: 'automation4@globalsubmit.com',
        password: '',
        workspace: 'Automation3 Space',
    },
    incorrect_user: {
        username: 'incorrect@globalsubmit.com',
        password: 'incorrect',
        workspace: 'Not found',
    },
    noPermissionsUser: {
        username: 'automation31@globalsubmit.com',
        password: '',
    },
    singleSpaceUser: {
        username: 'automation4@globalsubmit.com',
        password: '',
        workspace: 'Automation4 Space',
      
    },
};

const current_version = '26.2.1.2098';

export { credentials, base_url, current_version };