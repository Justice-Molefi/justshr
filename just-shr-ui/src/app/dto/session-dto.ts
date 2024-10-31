import { User } from "../model/user.model"

export interface SessionDTO{
    sessionId: string
    email: string,
    content: string,
    description: string,
    created: String
    members: User[]
    
}