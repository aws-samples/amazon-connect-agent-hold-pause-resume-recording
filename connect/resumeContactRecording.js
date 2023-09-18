
const { ConnectClient, ResumeContactRecordingCommand } = require("@aws-sdk/client-connect");

const InstanceARN = process.env.InstanceARN;

const resumeContactRecording = {

    async process(ContactId) {           
        let arnList = (InstanceARN).split("/");

        const input = { 
            'InstanceId': arnList[1], 
            'ContactId': ContactId, 
            'InitialContactId': ContactId
        };

        const client = new ConnectClient({ region: process.env.AWS_REGION });
        const command = new ResumeContactRecordingCommand(input);

        console.log('resumeContactRecording input',input);

        const response = await client.send(command);
    
        console.log("resumeContactRecording response - ", response);
    }
}
module.exports = resumeContactRecording;
