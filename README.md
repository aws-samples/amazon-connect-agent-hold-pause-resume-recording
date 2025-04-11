# Amazon Connect Agent Hold Stop Recording

## Introduction

Amazon Connect offers the ability to record calls that take place between an agent and caller, including when calls are placed on hold. However, there are scenarios where contact centers might prefer to pause recording during hold periods. This solution addresses that need by automatically pausing and resuming call recordings based on hold status.

### What This Solution Does

This solution automatically pauses call recording when an agent places a caller on hold and resumes recording when the call is taken off hold. It achieves this by:

1. Utilizing Amazon Kinesis to stream Agent Events from Amazon Connect.
2. Employing an AWS Lambda function to monitor these events for hold status changes.
3. Interacting with the Amazon Connect API to suspend and resume call recordings in real-time.
4. Logging hold events in Amazon DynamoDB for verification and auditing purposes.

By implementing this solution, contact centers can address several key concerns:

1. Privacy concerns: Prevent recording of agent conversations that occur while a caller is on hold.
2. Quality assurance efficiency: Enable supervisors and QA teams to easily distinguish between active call segments and hold periods during review.
3. Improved transcript accuracy: Ensure that call transcripts and word searches only include relevant customer interactions, excluding hold periods.
4. Enhanced sentiment analysis: Prevent hold music or background conversations from influencing sentiment analysis results.

This serverless architecture provides a scalable, cost-effective way to enhance call recording management in Amazon Connect, improving both operational efficiency and compliance with privacy standards.

## Prerequisites

It is assumed that you understand the use of the services below and you have the following prerequisites:
1.  An AWS account with both management console and programmatic administrator access.
2.  An existing Amazon Connect instance.
3.  An Amazon Kinesis Stream

## Architecture diagram 

![Architecture Diagram](/images/diagram.png)

In the above architecture, when an agent places a caller on or off hold, an Agent Event is created. Using Amazon Kinesis, Agent Events can be streamed out of Connect. Amazon Lambda can be configured as a consumer of Kinesis streams to watch for specific Agent Events, in this case, anytime a caller is placed on hold or removed from hold. Lambda can call the Amazon Connect API [SuspendContactRecording](https://docs.aws.amazon.com/connect/latest/APIReference/API_SuspendContactRecording.html) when an ONHOLD event is detected to pause the call recording and conversely call the API [ResumeContactRecording](https://docs.aws.amazon.com/connect/latest/APIReference/API_ResumeContactRecording.html) when an OFFHOLD event is detected to resume the recording.

A DynamoDB table is also create to verify the solution is working by recording when ONHOLD and OFFHOLD events take place.


## Walkthrough

1.	Download the zip file code for this repository [here](zip/connect-agent-hold-stop-recording.zip).
2.	Create an S3 solution bucket within the same region where the Amazon Connect instance is located.
3.	Upload the zip file downloaded in step one to the new bucket. 
4.	Run the CloudFormation Template located [here](cft/connect-agent-event-cft.yaml).
5.	Following parameters needed for the CloudFormation Template:
    1.	InstanceARN: ARN of the Amazon Connect instance.
    2.	StreamARN: ARN of the Kinesis stream used for Agent Events. If the Connect instance is not currently streaming Agent Events, see [here](https://docs.aws.amazon.com/connect/latest/adminguide/agent-event-streams.html) for steps on how to enable Agent Event Streaming.
    3.	SolutionSourceBucket: S3 Bucket created in step three.

![CloudFormation Template Screenshot](/images/stack_details.png)

## Validate

1.	Navigate to Amazon Connect and log in as an Agent.
2.	Place an inbound call and answer the call as the agent.
3.  Speak into the mic from the agent side.
3.	From the CCP, place the call on hold. Speak into the mic as the agent.
4.  From the CCP, remove the call from hold. Speak into the mic as the agent and then end the call.
5.  Navigate to Contact Seach within the Amazon Connect Console and locate the call. Play the call recording to confirm that no audio was captured while the call was on hold.
6.  Navigate to Dynamo DB  and explore the table items of the **HoldEventLogTable**. Confirm CONNECTED and CONNECTED_ONHOLD events exist.

## Conclusion

In this guide, you learned how to stream Amazon Connect Agent Events in order to pause and resume call recordings for calls that are placed on hold.

> [!WARNING]
> This solution not only pauses and resumes audio call recordings but also affects screen recordings in Amazon Connect. When call recording is suspended during hold periods, any active screen recording will also be paused simultaneously.

