# Amazon Connect Agent Hold Stop Recording

## Introduction

Amazon Connect offers the ability to record calls that take place between an agent and caller. This includes calls that are placed on hold. However, there are some cases where a contact center might not want to record the call while a caller is placed on hold. Some examples include:

1.  Privacy concerns for agent conversations that take place while the call is on hold.
2.  Supervisors and QA reviewing calls and not being able to easily distinguish when a call has been placed on hold.
3.  If call transcripts are enabled, supervisors might search for words spoken to callers. Results could include calls where the searched words were actually spoken while the caller was on hold.
4.  If sentiment analsysis is enabled, audio from either party while the call is on hold could adversely affect the sentiment data.


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
2.	Create a S3 solution bucket in your AWS account.
3.	Upload he Zip file downloaded in step 1
5.	Run the CFT located [here](cft/connect-agent-event-cft.yaml).
6.	Following parameters needed for the CFT:
    1.	InstanceARN: ARN of the Amazon Connect instance.
    2.	StreamARN: ARN of the Kinesis stream used for Agent Events. If the Connect instance is not currently streaming Agent Events, see [here](https://docs.aws.amazon.com/connect/latest/adminguide/agent-event-streams.html) for steps on how to enable Agent Event Streaming.
    3.	SolutionSourceBucket: Solution bucket created in step 3

![CloudFormation Template Screenshot](/images/stack_details.png)

## Validate

1.	Navigate to Amazon Connect and log in as an Agent.
2.	Place an inbound call and answer the call as the agent.
3.  Speak into the mic from the agent side.
3.	From the CCP, place the call on hold. Speak into the mic as the agent.
4.  From the CCP, remove the call from hold. Speak into the mic as the agent and then end the call.
5.  Navigate to Contact Seach within the Amazon Connect Console and locate the call. Play the call recording to confirm that no audio was captured while the call was on hold.
6.  Navigate to Dynamo DB  and explore the table items of the **HoldEventLogTable**. Confirm ONHOLD and OFFHOLD events exist.

## Conclusion

In this guide, you learned how to stream Amazon Connect Agent Events in order to pause and resume call recordings for calls that are placed on hold.
