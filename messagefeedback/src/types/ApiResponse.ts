import { Message } from "@/model/User";

//this is a standardiazation of the api response sending from backend to frontend
export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}