import { Client as WorkflowClient } from "@upstash/workflow"
import { envVariables } from "./env"

export const workFlowClient = new WorkflowClient({
    baseUrl: envVariables.qstashUrl,
    token: envVariables.qstashToken,
})