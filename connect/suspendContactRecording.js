
const { ConnectClient, SuspendContactRecordingCommand } = require("@aws-sdk/client-connect");

const InstanceARN = process.env.InstanceARN;

const suspendContactRecording = {

    async process(ContactId) {
        let arnList = (InstanceARN).split("/");
        
        const input = { 
            'InstanceId': arnList[1], 
            'ContactId': ContactId, 
            'InitialContactId': ContactId
        };
            
        const client = new ConnectClient({ region: process.env.AWS_REGION });
        const command = new SuspendContactRecordingCommand(input);

        console.log('suspendContactRecording input',input);

        const response = await client.send(command);
    
        console.log("suspendContactRecording response - ", response);
    }
}
module.exports = suspendContactRecording;
