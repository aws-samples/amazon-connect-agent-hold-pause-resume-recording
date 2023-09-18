const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
	apiVersion: '2012-08-10',
	sslEnabled: false,
	paramValidation: false,
	convertResponseTypes: false
});
const tableName = process.env.HoldEventLogTable;

const holdEvent = {

    async save(eventId, ContactId, State, StateTimestamp) {
    
        var inputTextToDB = '{"eventId": "' + eventId +
            '","ContactId": "' + ContactId +
            '","State": "' + State +
            '","StateTimestamp" : "' + StateTimestamp + '"}';
    
        var paramsIns = {
            TableName: tableName,
            Item: JSON.parse(inputTextToDB)
        };
        
        console.log('dynamodbEvent saveCaseUpdate paramsIns : ' , paramsIns);
        const response = await docClient.put(paramsIns).promise();
        return response;
    }
}
module.exports = holdEvent;