
const constants = require('./common/constants.js') ;
const holdEvent = require('./dynamodb/holdEvent.js') ;
const resumeContactRecording = require('./connect/resumeContactRecording.js');
const suspendContactRecording = require('./connect/suspendContactRecording.js');

exports.handler = async function (event, context, callback) {
    //console.log("INPUT -  ", JSON.stringify(event));
    let result = {};
    try{
    for (let i = 0; i < event.Records.length; i++) {
        let kinesisData = JSON.parse(Buffer.from(event.Records[i].kinesis.data, 'base64').toString('ascii'));

        if(kinesisData.EventType === constants.STATE_CHANGE){
            console.log(kinesisData.CurrentAgentSnapshot);
            if(kinesisData.CurrentAgentSnapshot && 
                kinesisData.CurrentAgentSnapshot.Contacts && 
                kinesisData.CurrentAgentSnapshot.Contacts.length >0 && 
                kinesisData.CurrentAgentSnapshot.Contacts[0].State === constants.CONNECTED_ONHOLD){

                console.log(kinesisData.CurrentAgentSnapshot.Contacts[0]);
                let contactId = kinesisData.CurrentAgentSnapshot.Contacts[0].ContactId;
                
                await holdEvent.save(kinesisData.EventId, contactId, kinesisData.CurrentAgentSnapshot.Contacts[0].State, kinesisData.CurrentAgentSnapshot.Contacts[0].StateStartTimestamp);

                console.log('contactId on hold',contactId);
                await suspendContactRecording.process(contactId);

            }
            else{
                if(kinesisData.CurrentAgentSnapshot && 
                kinesisData.CurrentAgentSnapshot.Contacts && 
                kinesisData.CurrentAgentSnapshot.Contacts.length >0 && 
                kinesisData.CurrentAgentSnapshot.Contacts[0].State === constants.CONNECTED
                ){
                    if(kinesisData.PreviousAgentSnapshot && 
                        kinesisData.PreviousAgentSnapshot.Contacts && 
                        kinesisData.PreviousAgentSnapshot.Contacts.length > 0 && 
                        kinesisData.PreviousAgentSnapshot.Contacts[0].State === constants.CONNECTED_ONHOLD){
                        let contactId = kinesisData.PreviousAgentSnapshot.Contacts[0].ContactId;
                
                        await holdEvent.save(kinesisData.EventId, contactId, kinesisData.CurrentAgentSnapshot.Contacts[0].State, kinesisData.CurrentAgentSnapshot.Contacts[0].StateStartTimestamp);

                        console.log('contactId resumed from hold',contactId);
                        await resumeContactRecording.process(contactId);

                    }
                }            
            }
        }
    
        
    }
    }catch (error) {
        console.error('error',error);
    }
    callback(null, result);
};

